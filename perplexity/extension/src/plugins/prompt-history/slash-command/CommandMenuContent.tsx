import { usePopoverContext } from "@ark-ui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useHotkeys } from "react-hotkeys-hook";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  useCommandListManualScroll,
} from "@/components/ui/command";
import { CommandItemSkeleton } from "@/components/ui/command";
import { queryClient } from "@/data/query-client";
import { getPlatform } from "@/hooks/usePlatformDetection";
import ClearAllButton from "@/plugins/prompt-history/components/ClearAllButton";
import useLoadMoreItems from "@/plugins/prompt-history/hooks/useLoadMoreItems";
import { usePromptHistory } from "@/plugins/prompt-history/hooks/usePromptHistory";
import { getPromptHistoryService } from "@/plugins/prompt-history/indexed-db/get-service";
import { promptHistoryQueries } from "@/plugins/prompt-history/indexed-db/query-keys";
import PromptHistoryCommandMenuItem from "@/plugins/prompt-history/slash-command/CommandMenuItem";
import { keysToString } from "@/utils/utils";

export function PromptHistoryCommandMenuContent() {
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

  const commandListRef = useRef<HTMLDivElement | null>(null);

  useCommandListManualScroll({
    enabled: true,
    commandListRef,
    willUpdateValue: selectingValue,
  });

  const { triggerRef } = useLoadMoreItems({
    hasNextPage,
    isFetching,
    fetchNextPage,
  });

  const deleteItem = useCallback((id: string) => {
    getPromptHistoryService().delete(id);

    queryClient.invalidateQueries({
      queryKey: promptHistoryQueries.infinite.all(),
    });
  }, []);

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

      deleteItem(prompt.id);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  const { getContentProps } = usePopoverContext();

  const placement = (getContentProps() as any)["data-placement"] as
    | `bottom-${string}`
    | `top-${string}`
    | undefined;

  if (items == null) return null;

  return (
    <Command
      className={cn("x:flex x:bg-background x:dark:bg-secondary", {
        "x:flex-col-reverse": placement?.startsWith("top"),
      })}
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
      <CommandList
        ref={commandListRef}
        data-prompt-history-command-list
        className="x:h-[200px]"
      >
        <CommandGroup>
          {items.map((item) => (
            <PromptHistoryCommandMenuItem
              key={item.id}
              searchValue={searchValue}
              item={item}
              onDelete={deleteItem}
            />
          ))}
        </CommandGroup>
        {!isLoading && (
          <CommandEmpty className="x:flex x:w-full x:items-center x:justify-center">
            {t("plugin-prompt-history.search.noResults")}
          </CommandEmpty>
        )}
        {(isLoading || isFetchingNextPage) && (
          <CommandItemSkeleton count={3} className="x:h-5" />
        )}
        {hasNextPage && <div ref={triggerRef} className="x:h-10" />}
      </CommandList>
    </Command>
  );
}
