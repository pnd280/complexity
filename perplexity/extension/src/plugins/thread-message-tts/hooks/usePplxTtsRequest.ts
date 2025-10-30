import { useMutation } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

import { APP_CONFIG } from "@/app.config";
import { InternalWebSocketManager } from "@/plugins/__core__/pplx-web-socket";
import type { TtsVoice } from "@/plugins/thread-message-tts/types";

type UsePplxTtsRequestProps = {
  onBufferUpdate?: (chunk: Int16Array) => void;
  onStreamComplete: () => void;
  onError?: () => void;
};

export default function usePplxTtsRequest({
  onBufferUpdate,
  onError,
  onStreamComplete,
}: UsePplxTtsRequestProps) {
  const socketRef = useRef<Socket | null>(null);

  const { reset, mutateAsync, isPending } = useMutation({
    mutationFn: async (params?: { voice: TtsVoice; backendUuid: string }) => {
      invariant(params?.backendUuid, "[ThreadMessageTts] Invalid context");

      const [socket] = await tryCatch(() =>
        InternalWebSocketManager.getInstance().handShake({
          upgrade: APP_CONFIG.BROWSER === "chrome",
        }),
      );

      socketRef.current = socket;

      invariant(socket != null, "[ThreadMessageTts] Invalid context");

      const handleAudio = (packet: {
        data: ArrayLike<number> | null;
        uuid: string;
      }) => {
        if (packet.uuid === params.backendUuid && packet.data != null) {
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
          abort();
          onStreamComplete();
        }
      };

      socket.io.on("packet", handleError);
      socket.on("audio", handleAudio);

      await socket.emitWithAck("voice_over", {
        is_page: false,
        version: "2.13",
        completed: true,
        uuid: params.backendUuid,
        preset: params.voice,
      });

      onStreamComplete();

      socket.off("audio", handleAudio);
      socket.io.off("packet", handleError);

      socket.disconnect();
    },
  });

  const abort = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    reset();
  }, [reset]);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    abort,
    isPending,
    playTts: mutateAsync,
  };
}
