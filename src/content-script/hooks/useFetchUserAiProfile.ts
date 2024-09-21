import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useInit } from "@/content-script/hooks/useInit";
import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import PplxApi from "@/services/PplxApi";
import { UserAiProfileApiResponse } from "@/types/pplx-api.types";

export default function useFetchUserAiProfile({
  ...props
}: Omit<
  UseQueryOptions<UserAiProfileApiResponse>,
  "queryKey" | "queryFn"
> = {}) {
  const { isLoggedIn } = usePplxAuth();
  const { isWebSocketCaptured, isInternalWebSocketInitialized } = useInit();

  return useQuery<UserAiProfileApiResponse>({
    queryKey: ["userAiProfile"],
    queryFn: PplxApi.fetchUserAiProfile,
    enabled:
      isWebSocketCaptured && isInternalWebSocketInitialized && isLoggedIn,
    ...props,
  });
}
