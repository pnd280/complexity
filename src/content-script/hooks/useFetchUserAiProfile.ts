import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import { useGlobalStore } from "@/content-script/session-store/global";
import PplxApi from "@/services/PplxApi";
import { UserAiProfileApiResponse } from "@/types/pplx-api.types";


export default function useFetchUserAiProfile({
  ...props
}: Omit<
  UseQueryOptions<UserAiProfileApiResponse>,
  "queryKey" | "queryFn"
> = {}) {
  const { isLoggedIn } = usePplxAuth();
  const isReady = useGlobalStore(
    ({ internalWebSocketInitialized, isWebSocketCaptured }) =>
      isWebSocketCaptured && internalWebSocketInitialized,
  );

  return useQuery<UserAiProfileApiResponse>({
    queryKey: ["userAiProfile"],
    queryFn: PplxApi.fetchUserAiProfile,
    enabled: isReady && isLoggedIn,
    ...props,
  });
}
