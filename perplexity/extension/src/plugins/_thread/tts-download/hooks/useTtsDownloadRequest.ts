import { useMutation } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

import { APP_CONFIG } from "@/app.config";
import { InternalWebSocketManager } from "@/entrypoints/contexts/content-scripts/core-plugins/pplx-web-socket";
import type { TtsVoice } from "@/plugins/_thread/tts-download/types";
import { AudioBufferCollector } from "@/plugins/_thread/tts-download/utils/audio-buffer-collector";

type UseTtsDownloadRequestProps = {
  onComplete?: (chunks: Int16Array[]) => void;
  onError?: () => void;
};

export default function useTtsDownloadRequest({
  onComplete,
  onError,
}: UseTtsDownloadRequestProps = {}) {
  const socketRef = useRef<Socket | null>(null);
  const collectorRef = useRef<AudioBufferCollector | null>(null);

  const { reset, mutateAsync, isPending } = useMutation({
    mutationFn: async (params?: { voice: TtsVoice; backendUuid: string }) => {
      invariant(params?.backendUuid, "[TtsDownload] Invalid context");

      // Create a new collector for this download
      collectorRef.current = new AudioBufferCollector();

      const [socket] = await tryCatch(() =>
        InternalWebSocketManager.getInstance().handShake({
          upgrade: APP_CONFIG.BROWSER === "chrome",
        }),
      );

      socketRef.current = socket;

      invariant(socket != null, "[TtsDownload] Invalid context");

      const handleAudio = (packet: {
        data: ArrayLike<number> | null;
        uuid: string;
      }) => {
        if (
          packet.uuid === params.backendUuid &&
          packet.data != null &&
          collectorRef.current
        ) {
          const chunk = new Int16Array(packet.data);
          collectorRef.current.addChunk(chunk);
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

      // Get collected chunks
      const chunks = collectorRef.current.getAllChunks();

      // Call completion callback
      onComplete?.(chunks);

      socket.off("audio", handleAudio);
      socket.io.off("packet", handleError);

      socket.disconnect();

      return chunks;
    },
  });

  const abort = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    collectorRef.current?.clear();
    collectorRef.current = null;
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
    downloadTts: mutateAsync,
  };
}
