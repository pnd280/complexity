import { cn } from "@/utils/cn";
import { CommandEmpty } from "cmdk";
import $ from "jquery";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useQuickQueryCommanderParams from "@/content-script/hooks/useQuickQueryCommanderParams";
import useRouter from "@/content-script/hooks/useRouter";
import PPLXApi from "@/services/PPLXApi";
import KeyCombo from "@/shared/components/KeyCombo";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/shadcn/ui/command";
import UIUtils from "@/utils/UI";
import { useQuery } from "@tanstack/react-query";
import { useToggle, useWindowSize } from "@uidotdev/usehooks";

export type QuickCommanderProps = {
  context: "main" | "follow-up";
  $trigger: JQuery<HTMLElement>;
  $textarea: JQuery<HTMLTextAreaElement>;
  searchValue?: string;
  setQuickCommandSearchValue: (value: string) => void;
};

export default function QuickQueryCommander({
  context,
  $trigger,
  $textarea,
  searchValue,
  setQuickCommandSearchValue,
}: QuickCommanderProps) {
  const { url } = useRouter();

  useWindowSize();

  const commanderRef = useRef<HTMLDivElement>(null);

  const [visible, toggleVisibility] = useToggle(false);
  const { quickQueryParams } = useQuickQueryCommanderParams({
    context,
  });
  const [value, setValue] = useState("");

  const sortedQuickQueryParams = useMemo(() => {
    const top = quickQueryParams.find((param) =>
      ("@" + searchValue).startsWith(param.prefix),
    );

    if (top) {
      return [top, ...quickQueryParams.filter((param) => param !== top)];
    }

    return quickQueryParams;
  }, [quickQueryParams, searchValue]);

  const setPos = () => {
    if (commanderRef.current) {
      commanderRef.current.style.bottom =
        window.innerHeight -
        Math.round($trigger?.offset()?.top || 0) +
        5 +
        "px";
      commanderRef.current.style.left = $trigger?.offset()?.left + "px";
      commanderRef.current.style.width =
        Math.round($trigger.outerWidth()!) + "px";
    }
  };

  visible && setPos();

  const handleSetVisible = useCallback(
    (state?: boolean) => {
      toggleVisibility(state);
      $("html").toggleClass("!tw-overflow-y-hidden", state);
    },
    [toggleVisibility],
  );

  const dispatchKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (visible) {
        commanderRef.current?.dispatchEvent(new KeyboardEvent("keydown", e));
      }
    },
    [visible, commanderRef],
  );

  const isInterceptableNavigationKey = useCallback(
    (e: JQuery.TriggeredEvent) =>
      (e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Enter" ||
        e.key === "Escape") &&
      visible,
    [visible],
  );

  const postSelection = ({
    textarea,
    newText,
    start,
  }: {
    textarea: HTMLTextAreaElement;
    newText: string;
    start: number;
  }) => {
    UIUtils.setReactTextareaValue(textarea as HTMLTextAreaElement, newText);
    textarea.setSelectionRange(start, start);
    handleSetVisible(false);
    UIUtils.getActiveQueryBoxTextarea({})?.trigger("focus");
  };

  useEffect(() => {
    !value.trim().length && handleSetVisible(false);
  }, [value, handleSetVisible]);

  useEffect(() => {
    if (!$textarea.length) return;

    const textarea = $textarea[0];

    const down = (e: JQuery.TriggeredEvent) => {
      const { word: wordAtCaret } = UIUtils.getWordOnCaret(textarea);

      if (wordAtCaret.trim().length < 1) {
        handleSetVisible(false);
        return;
      }

      if (isInterceptableNavigationKey(e)) {
        if (e.key === "Escape") {
          return handleSetVisible(false);
        }

        return (
          e.originalEvent && dispatchKeydown(e.originalEvent as KeyboardEvent)
        );
      }

      if (
        (e.key === "@" || (e.ctrlKey && e.key === " ")) &&
        wordAtCaret.startsWith("@")
      ) {
        handleSetVisible(true);
      }

      setQuickCommandSearchValue(wordAtCaret);
    };

    $(textarea).on("keydown", (e) => {
      if (isInterceptableNavigationKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      setTimeout(down.bind(null, e), 0);
    });

    $(textarea).on("blur", (e) => {
      if (e.relatedTarget === commanderRef.current) return;

      handleSetVisible(false);
    });

    $(document).on("click", (e) => {
      if (textarea.contains(e.target)) return;

      handleSetVisible(false);
    });

    return () => {
      $(textarea).off("keydown");
    };
  }, [
    $textarea,
    visible,
    searchValue,
    dispatchKeydown,
    setQuickCommandSearchValue,
    handleSetVisible,
    isInterceptableNavigationKey,
  ]);

  const { refetch: refetchThreadInfo } = useQuery({
    queryKey: ["currentThreadInfo"],
    queryFn: () =>
      PPLXApi.fetchThreadInfo(window.location.pathname.split("/").pop() || ""),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetchThreadInfo();
  }, [url, refetchThreadInfo]);

  return (
    <Command
      className={cn(
        "!tw-absolute tw-z-30 tw-h-max tw-max-h-[200px] tw-w-max tw-rounded-lg tw-border tw-font-sans tw-shadow-md !tw-outline-none tw-animate-in tw-fade-in",
        {
          "tw-hidden": !visible,
        },
      )}
      id="quick-commander"
      ref={commanderRef}
      onValueChange={(value) => {
        if (!visible) {
          return;
        }
        setValue(value);
      }}
      value={value}
    >
      <div className="tw-hidden">
        <CommandInput value={searchValue} />
      </div>
      <CommandList>
        <CommandEmpty className="tw-p-2 tw-text-center tw-font-sans tw-text-sm tw-text-muted-foreground">
          No results found.
        </CommandEmpty>
        {!searchValue &&
          quickQueryParams.map((param) => (
            <CommandItem key={param.type}>
              <div className="tw-flex tw-items-center tw-gap-2">
                {param.heading}
                <KeyCombo keys={[param.prefix]} />
              </div>
            </CommandItem>
          ))}
        {searchValue &&
          sortedQuickQueryParams.map((param) => {
            return (
              <Fragment key={param.type}>
                <CommandGroup
                  heading={
                    <div className="tw-flex tw-items-center tw-gap-2 tw-text-accent-foreground">
                      {param.heading}
                      <KeyCombo keys={[param.prefix]} />
                    </div>
                  }
                >
                  {param.optionItems
                    .filter((optionItem) => !optionItem.disabled)
                    .map((optionItem) => (
                      <div key={optionItem.value}>
                        <CommandItem
                          value={optionItem.value}
                          className="tw-flex tw-items-center"
                          keywords={[
                            param.prefix,
                            ...optionItem.keywords.map(
                              (keyword) => param.prefix + keyword,
                            ),
                          ]}
                          onSelect={() => {
                            const { newText, start } = UIUtils.getWordOnCaret(
                              $textarea[0],
                            );

                            postSelection({
                              textarea: $textarea[0],
                              newText,
                              start,
                            });

                            optionItem.onSelect();
                            handleSetVisible(false);
                          }}
                        >
                          <div className="tw-flex tw-min-w-max tw-gap-2">
                            <div className="tw-flex tw-h-4 tw-w-4 tw-items-center">
                              {optionItem.icon}
                            </div>
                            <div>{optionItem.label}</div>
                          </div>
                          {optionItem.hint && (
                            <div className="tw-ml-2 tw-max-w-[500px] tw-truncate tw-text-xs tw-text-muted-foreground">
                              {optionItem.hint}
                            </div>
                          )}
                        </CommandItem>
                      </div>
                    ))}
                </CommandGroup>
              </Fragment>
            );
          })}
      </CommandList>
    </Command>
  );
}
