import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { getPromptHistoryProxyService } from "@/plugins/prompt-history/indexed-db/proxy";

export const ITEMS_PER_PAGE = 10;

export const promptHistoryQueries = {
  all: () => ["promptHistory"] as const,

  infinite: {
    all: () => [...promptHistoryQueries.all(), "infinite"] as const,
    detail: ({
      initialPageParam,
      searchTerm,
    }: {
      initialPageParam?: number;
      searchTerm?: string;
    }) =>
      infiniteQueryOptions({
        queryKey: [
          ...promptHistoryQueries.infinite.all(),
          { searchTerm },
        ] as const,
        queryFn: (ctx) =>
          getPromptHistoryProxyService().getPaginatedItems({
            searchTerm,
            offset: ctx.pageParam * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          }),
        initialPageParam: initialPageParam ?? 0,
        getNextPageParam: (lastPage, allPages) => {
          const totalFetched = allPages.reduce(
            (acc, page) => acc + page.items.length,
            0,
          );
          return totalFetched < lastPage.total ? allPages.length : undefined;
        },
      }),
  },

  list: {
    all: () => [...promptHistoryQueries.all(), "list"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...promptHistoryQueries.list.all()] as const,
        queryFn: () => getPromptHistoryProxyService().getAll(),
      }),
  },

  get: {
    all: () => [...promptHistoryQueries.all(), "get"] as const,
    detail: (id: string) =>
      queryOptions({
        queryKey: [...promptHistoryQueries.get.all(), { id }] as const,
        queryFn: async () => {
          const item = await getPromptHistoryProxyService().get(id);
          if (item == null) throw new Error("Item not found");
          return item;
        },
      }),
  },
};
