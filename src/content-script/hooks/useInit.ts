import { useQuery } from "@tanstack/react-query";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";

export function useInit() {
  const { data: isWebSocketCaptured } = useQuery({
    queryKey: ["isWebSocketCaptured"],
    queryFn: async () => {
      const isCaptured = await webpageMessenger.sendMessage({
        event: "isWebSocketCaptured",
        timeout: 100,
      });

      if (!isCaptured) throw new Error("WebSocket not captured");

      return true;
    },
    retry: Infinity,
  });

  const { data: isInternalWebSocketInitialized } = useQuery({
    queryKey: ["isInternalWebSocketInitialized"],
    queryFn: async () => {
      const isInitialized = await webpageMessenger.sendMessage({
        event: "isInternalWebSocketInitialized",
        timeout: 100,
      });

      if (!isInitialized) throw new Error("Internal WebSocket not initialized");

      return true;
    },
    refetchInterval: (data) =>
      data.state.status === "success" && data.state.data === true ? false : 100,
    retry: Infinity,
  });

  return {
    isWebSocketCaptured: isWebSocketCaptured === true,
    isInternalWebSocketInitialized: isInternalWebSocketInitialized === true,
  };
}
