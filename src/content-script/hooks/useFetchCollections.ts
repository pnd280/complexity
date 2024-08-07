import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { Collection } from "@/content-script/components/QueryBox/CollectionSelector/CollectionSelector";
import PplxApi from "@/services/PplxApi";

export default function useFetchCollections({
  ...props
}: Omit<UseQueryOptions<Collection[]>, "queryKey" | "queryFn"> = {}) {
  return useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: PplxApi.fetchCollections,
    ...props,
  });
}
