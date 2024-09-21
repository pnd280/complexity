import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import PplxApi from "@/services/PplxApi";
import { Collection } from "@/types/collection.types";

export default function useFetchCollections({
  ...props
}: Omit<UseQueryOptions<Collection[]>, "queryKey" | "queryFn"> = {}) {
  const { isLoggedIn } = usePplxAuth();

  return useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: PplxApi.fetchCollections,
    enabled: isLoggedIn,
    ...props,
  });
}
