import { usePopoverContext } from "@ark-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useHotkeys } from "react-hotkeys-hook";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { CommandItemSkeleton } from "@/components/ui/command";
import { getPlatform } from "@/hooks/usePlatformDetection";
import ClearAllButton from "@/plugins/prompt-history/components/ClearAllButton";
import useLoadMoreItems from "@/plugins/prompt-history/hooks/useLoadMoreItems";
import { usePromptHistory } from "@/plugins/prompt-history/hooks/usePromptHistory";
import { promptHistoryQueries } from "@/plugins/prompt-history/indexed-db/query-keys";
import { PromptHistoryService } from "@/plugins/prompt-history/indexed-db/service-init.bg-worker";
import PromptHistoryCommandMenuItem from "@/plugins/prompt-history/slash-command/CommandMenuItem";
import { keysToString } from "@/utils/misc/utils";

export function PromptHistoryCommandMenuContent() {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [selectingValue, setSelectingValue] = useState("");

  const debouncedSearchValue = useDebounce(searchValue, 200);
  const {
    items,
    query: {
      isLoading,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
    },
  } = usePromptHistory({
    searchValue: debouncedSearchValue,
    enabled: true,
  });

  const { triggerRef } = useLoadMoreItems({
    hasNextPage,
    isFetching,
    fetchNextPage,
  });

  const deleteItem = async (id: string) => {
    await PromptHistoryService.Instance.delete(id);

    if (items != null) {
      const currentIndex = items.findIndex((item) => item.id === id);

      if (currentIndex !== -1 && items.length > 1) {
        const nextIndex =
          currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex - 1;
        const nextItem = items[nextIndex];
        if (nextItem != null) {
          setSelectingValue(nextItem.id);
        }
      } else {
        setSelectingValue("");
      }
    }

    void queryClient.invalidateQueries({
      queryKey: promptHistoryQueries.infinite.all(),
    });
  };

  useHotkeys(
    keysToString([getPlatform() === "mac" ? Key.Meta : Key.Control, "c"]),
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      $(`[data-value='${selectingValue}'] [data-copy-button]`).trigger("click");
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  useHotkeys(
    Key.Delete,
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const prompt = items?.find((item) => item.id === selectingValue);

      if (prompt == null) return;

      void deleteItem(prompt.id);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  const { getContentProps } = usePopoverContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placement = (getContentProps() as any)["data-placement"] as
    | `bottom-${string}`
    | `top-${string}`
    | undefined;

  return (
    <Command
      className={cn(
        "x:flex x:rounded-none x:bg-background x:dark:bg-secondary",
        {
          "x:flex-col-reverse": placement?.startsWith("top"),
        },
      )}
      value={selectingValue}
      onValueChange={setSelectingValue}
    >
      <CommandInput
        ref={(e) => e?.focus()}
        className={cn("x:text-xs x:[&_input]:h-8 x:[&_input]:p-0", {
          "x:border-t x:border-b-0": placement?.startsWith("top"),
        })}
        placeholder={t("plugin-prompt-history.search.placeholder")}
        searchIcon={searchValue.length <= 0 && <ClearAllButton />}
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList className="x:h-[200px] x:scroll-pt-10 x:scroll-pb-10">
        <CommandGroup>
          {items?.map((item) => (
            <PromptHistoryCommandMenuItem
              key={item.id}
              searchValue={searchValue}
              item={item}
              onDelete={deleteItem}
            />
          ))}
          {(isLoading || isFetchingNextPage) && (
            <CommandItemSkeleton count={3} className="x:h-5" />
          )}
        </CommandGroup>
        {!isLoading && (
          <CommandEmpty className="x:flex x:w-full x:items-center x:justify-center">
            {t("plugin-prompt-history.search.noResults")}
          </CommandEmpty>
        )}
        {hasNextPage && <div ref={triggerRef} className="x:h-30" />}
      </CommandList>
    </Command>
  );
}
