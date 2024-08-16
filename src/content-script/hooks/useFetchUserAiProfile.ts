import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGlobalStore } from "@/content-script/session-store/global";
import PplxApi from "@/services/PplxApi";
import { UserAiProfileApiResponse } from "@/types/pplx-api.types";

export default function useFetchUserAiProfile({
  ...props
}: Omit<
  UseQueryOptions<UserAiProfileApiResponse>,
  "queryKey" | "queryFn"
> = {}) {
  const isReady = useGlobalStore((state) => state.isWebSocketCaptured);

  return useQuery<UserAiProfileApiResponse>({
    queryKey: ["userAiProfile"],
    queryFn: PplxApi.fetchUserAiProfile,
    enabled: isReady,
    ...props,
  });
}
