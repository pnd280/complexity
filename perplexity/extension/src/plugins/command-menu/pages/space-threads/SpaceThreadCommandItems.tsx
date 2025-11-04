import { useDebounce } from "@uidotdev/usehooks";

import { CommandGroup } from "@/components/ui/command";
import { CommandItemSkeleton } from "@/components/ui/command";
import usePplxInfiniteSpaceThreads from "@/plugins/command-menu/pages/space-threads/usePplxInfiniteSpaceThreads";
import ThreadItem from "@/plugins/command-menu/pages/threads/ThreadItem";
import ThreadListLoader from "@/plugins/command-menu/pages/threads/ThreadListLoader";
import useLoadMoreItems from "@/plugins/command-menu/pages/threads/useLoadMoreItems";
import { useCommandMenuStore } from "@/plugins/command-menu/store";
import type { Space } from "@/services/externals/pplx-api/pplx-api.types";

export default function SpaceThreadCommandItems({
  spaceSlug,
}: {
  spaceSlug: Space["slug"];
}) {
  useCommandMenuStore((store) => store.open);

  const searchValue = useDebounce(
    useCommandMenuStore((store) => store.searchValue),
    300,
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = usePplxInfiniteSpaceThreads({
    spaceSlug,
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
          <CommandGroup>
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
