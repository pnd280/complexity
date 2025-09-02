import { useMutation } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

import { APP_CONFIG } from "@/app.config";
import { InternalWebSocketManager } from "@/plugins/_core/web-socket";
import type { TtsVoice } from "@/plugins/thread-message-tts/types";

export default function usePplxTtsRequest() {
  const socketRef = useRef<Socket | null>(null);

  const abort = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.disconnect();
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async ({
      backendUuid,
      voice,
      onBufferUpdate,
      onError,
    }: {
      backendUuid: string;
      voice?: TtsVoice;
      onBufferUpdate?: (chunk: Int16Array) => void;
      onError?: () => void;
    }) => {
      socketRef.current =
        await InternalWebSocketManager.getInstance().handShake({
          upgrade: APP_CONFIG.BROWSER === "chrome",
        });

      const socket = socketRef.current;

      if (socket == null) {
        throw new Error("No socket found");
      }

      const handleAudio = (packet: {
        data: ArrayLike<number>;
        uuid: string;
      }) => {
        if (packet.uuid === backendUuid && packet.data != null) {
          onBufferUpdate?.(new Int16Array(packet.data));
        }
      };

      const handleError = (packet: unknown) => {
        if (
          packet != null &&
          typeof packet === "object" &&
          "data" in packet &&
          Array.isArray(packet.data) &&
          packet.data.length > 1 &&
          "status" in packet.data[1] &&
          packet.data[1].status === "failed"
        ) {
          onError?.();
        }
      };

      socket.io.on("packet", handleError);
      socket.on("audio", handleAudio);

      await socket.emitWithAck("voice_over", {
        is_page: false,
        version: "2.13",
        completed: true,
        uuid: backendUuid,
        preset: voice ?? "Mike",
      });

      socket.off("audio", handleAudio);
      socket.io.off("packet", handleError);

      socket.disconnect();
    },
  });

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    abort,
    mutation,
  };
}
