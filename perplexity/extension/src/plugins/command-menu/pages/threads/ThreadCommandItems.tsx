import { useDebounce } from "@uidotdev/usehooks";

import { CommandGroup } from "@/components/ui/command";
import { CommandItemSkeleton } from "@/components/ui/command";
import { useThreadsSearchFilters } from "@/plugins/command-menu/pages/threads/filters/context";
import ThreadItem from "@/plugins/command-menu/pages/threads/ThreadItem";
import ThreadListLoader from "@/plugins/command-menu/pages/threads/ThreadListLoader";
import useLoadMoreItems from "@/plugins/command-menu/pages/threads/useLoadMoreItems";
import usePplxInfiniteThreads from "@/plugins/command-menu/pages/threads/usePplxInfiniteThreads";
import { useCommandMenuStore } from "@/plugins/command-menu/store";

export default function ThreadCommandItems() {
  useCommandMenuStore((store) => store.states.open);

  const searchValue = useDebounce(
    useCommandMenuStore((store) => store.states.searchValue),
    300,
  );

  const filters = useThreadsSearchFilters();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPlaceholderData,
    isFetchingNextPage,
  } = usePplxInfiniteThreads({
    searchValue,
    ascending: filters.state.ascending,
    querySourceFilter: filters.state.querySourceFilter,
    threadTypeFilter: filters.state.threadTypeFilter,
    withTemporaryThreads: filters.state.withTemporaryThreads,
  });

  const { triggerRef } = useLoadMoreItems({
    hasNextPage,
    isFetching,
    fetchNextPage,
  });

  return (
    <>
      {!isLoading && !isError && (
        <>
          <CommandGroup
            className={cn({
              "x:opacity-50": isPlaceholderData,
            })}
          >
            {data?.pages.map((page) =>
              page.map((thread) => (
                <ThreadItem
                  key={thread.uuid}
                  thread={thread}
                  searchValue={searchValue}
                />
              )),
            )}
          </CommandGroup>
          {isFetchingNextPage && (
            <CommandItemSkeleton count={3} className="x:h-14" />
          )}
          {hasNextPage && !isFetchingNextPage && (
            <div ref={triggerRef} className="x:h-30" />
          )}
        </>
      )}

      <ThreadListLoader isLoading={isLoading} isError={isError} />
    </>
  );
}
