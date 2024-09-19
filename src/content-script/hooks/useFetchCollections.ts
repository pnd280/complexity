import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGlobalStore } from "@/content-script/session-store/global";
import PplxApi from "@/services/PplxApi";
import { Collection } from "@/types/collection.types";

export default function useFetchCollections({
  ...props
}: Omit<UseQueryOptions<Collection[]>, "queryKey" | "queryFn"> = {}) {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);
  const isReady = useGlobalStore((state) => state.isWebSocketCaptured);

  return useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: PplxApi.fetchCollections,
    enabled: isReady && isLoggedIn,
    ...props,
  });
}
