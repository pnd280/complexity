import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGlobalStore } from "@/content-script/session-store/global";
import PplxApi from "@/services/PplxApi";
import { Collection } from "@/types/collection.types";

export default function useFetchCollections({
  ...props
}: Omit<UseQueryOptions<Collection[]>, "queryKey" | "queryFn"> = {}) {
  const isReady = useGlobalStore((state) => state.isLongPollingCaptured);

  return useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: PplxApi.fetchCollections,
    enabled: isReady,
    ...props,
  });
}
