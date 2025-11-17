import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import type { ThreadsSearchPayload } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";

export default function usePplxInfiniteThreads(
  params: Omit<ThreadsSearchPayload, "offset" | "limit">,
) {
  const query = useInfiniteQuery({
    ...pplxApiQueries.threads.infinite.detail({
      initialPageParam: 0,
      ...params,
    }),
    staleTime: ms("5s"),
    placeholderData: keepPreviousData,
  });

  return query;
}
