import { useQuery } from "@tanstack/react-query";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";

export function useInit() {
  const { data: isWebSocketCaptured } = useQuery({
    queryKey: ["isWebSocketCaptured"],
    queryFn: () =>
      webpageMessenger.sendMessage({
        event: "isWebSocketCaptured",
        timeout: 100,
      }),
    refetchInterval: (data) =>
      data.state.status === "success" && data.state.data === true ? false : 100,
    retry: Infinity,
  });

  const { data: isInternalWebSocketInitialized } = useQuery({
    queryKey: ["isInternalWebSocketInitialized"],
    queryFn: () =>
      webpageMessenger.sendMessage({
        event: "isInternalWebSocketInitialized",
        timeout: 100,
      }),
    refetchInterval: (data) =>
      data.state.status === "success" && data.state.data === true ? false : 100,
    retry: Infinity,
  });

  return {
    isWebSocketCaptured: isWebSocketCaptured === true,
    isInternalWebSocketInitialized: isInternalWebSocketInitialized === true,
  };
}
