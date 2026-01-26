import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import type { Space } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";

export default function usePplxInfiniteSpaceThreads({
  spaceSlug,
}: {
  spaceSlug: Space["slug"];
}) {
  const query = useInfiniteQuery({
    ...pplxApiQueries.space.threads.infinite.detail({
      initialPageParam: 0,
      spaceSlug,
    }),
    staleTime: ms("5s"),
    placeholderData: keepPreviousData,
  });

  return query;
}
