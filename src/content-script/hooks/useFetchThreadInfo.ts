import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { ThreadMessageApiResponse } from "@/types/pplx-api.types";

type UseFetchThreadInfoProps = Omit<
  UseQueryOptions<ThreadMessageApiResponse[]>,
  "queryKey" | "queryFn"
> & {
  slug: ThreadMessageApiResponse["thread_url_slug"];
};

export default function useFetchThreadInfo({
  slug,
  ...args
}: UseFetchThreadInfoProps) {
  const query = useQuery({
    queryKey: ["threadInfo", slug],
    queryFn: () => PplxApi.fetchThreadInfo(slug),
    enabled: !!slug && slug !== "new",
    ...args,
  });

  return query;
}
