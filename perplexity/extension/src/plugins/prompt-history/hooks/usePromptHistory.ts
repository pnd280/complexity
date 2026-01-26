import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { usePrevious } from "@uidotdev/usehooks";

import { promptHistoryQueries } from "@/plugins/prompt-history/indexed-db/query-keys";
import type { PromptHistory } from "@/plugins/prompt-history/types";

export function usePromptHistory({
  searchValue,
  enabled,
}: {
  searchValue: string;
  enabled: boolean;
}) {
  const queryClient = useQueryClient();

  const previousSearchValue = usePrevious(searchValue);

  const query = useInfiniteQuery({
    ...promptHistoryQueries.infinite.detail({
      searchTerm: searchValue,
      initialPageParam: 0,
    }),
    initialData: () => {
      return queryClient.getQueryData<
        InfiniteData<{ items: PromptHistory[]; total: number }, number>
      >(
        promptHistoryQueries.infinite.detail({
          searchTerm: previousSearchValue,
        }).queryKey,
      );
    },
    enabled,
  });

  const items = query.data?.pages.flatMap((page) =>
    page.items.map((item: PromptHistory) => ({
      id: item.id,
      prompt: item.prompt,
      createdAt: new Date(item.createdAt).toISOString(),
      keywords: item.prompt.split(" "),
    })),
  );

  return { query, items };
}
