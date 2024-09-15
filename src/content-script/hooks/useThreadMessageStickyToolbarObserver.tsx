import $ from "jquery";
import { useEffect } from "react";

import { languageModels } from "@/content-script/components/QueryBox/consts";
import {
  Container,
  ToggleToolbarVisibilityProps,
} from "@/content-script/components/ThreadMessageStickyToolbar";
import useWaitForMessagesContainer from "@/content-script/hooks/useWaitForMessagesContainer";
import { ReactNodeActionReturnType } from "@/content-script/main-world/react-node";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import DomObserver from "@/utils/DomObserver/DomObserver";
import { DomHelperSelectors, DomSelectors } from "@/utils/DomSelectors";
import UiUtils from "@/utils/UiUtils";
import { isDomNode, markdown2Html } from "@/utils/utils";

type UseThreadMessageStickyToolbarObserverProps = {
  toggleVisibility: (args: ToggleToolbarVisibilityProps) => void;
  updateContainers: (newContainers: Container[]) => void;
};

export default function useThreadMessageStickyToolbarObserver({
  toggleVisibility,
  updateContainers,
}: UseThreadMessageStickyToolbarObserverProps) {
  const { messagesContainer } = useWaitForMessagesContainer();

  useEffect(
    function toolbarObserver() {
      if (!isDomNode(messagesContainer) || !$(messagesContainer).length) return;

      requestAnimationFrame(callback);

      const id = "thread-message-sticky-toolbar";

      DomObserver.create(id, {
        target: messagesContainer,
        config: { childList: true, subtree: true },
        debounceTime: 200,
        source: "hook",
        onAny: callback,
      });

      function callback() {
        const newContainers: Container[] = [];

        const $messageBlocks = UiUtils.getMessageBlocks();

        $messageBlocks.forEach(({ $query, $messageBlock, $answer }, index) => {
          queueMicrotask(() => {
            $($query[0]).addClass("tw-relative");

            let $container = $messageBlock.find(
              ".thread-message-toolbar-container",
            );

            if (!$container.length) {
              $container = $("<div>").addClass(
                `thread-message-toolbar-container tw-sticky tw-top-[3.35rem] tw-z-[9] tw-mt-4 !tw-h-[3.125rem] tw-w-full`,
              );
              $($query[0]).before($container);
            }

            newContainers.push({
              container: $container[0],
              query: $query[0],
              messageBlock: $messageBlock[0],
              answer: $answer[0],
            });

            toggleVisibility({
              bottomButtonBar: $messageBlock.find(
                DomSelectors.THREAD.MESSAGE.BOTTOM_BAR,
              )[0],
              index,
              messageBlock: $messageBlock[0],
            });

            if (index === $messageBlocks.length - 1) {
              updateContainers(newContainers);
            }
          });
        });
      }

      return () => {
        DomObserver.destroy(id);
      };
    },
    [messagesContainer, toggleVisibility, updateContainers],
  );

  useEffect(
    function displayModelObserver() {
      if (!isDomNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = "display-model-next-to-answer-heading";

      requestIdleCallback(callback);

      DomObserver.create(id, {
        target: messagesContainer,
        config: {
          childList: true,
          subtree: true,
        },
        debounceTime: 200,
        source: "hook",
        onAny: callback,
      });

      async function callback() {
        $(
          `${DomHelperSelectors.THREAD.MESSAGE.BLOCK}:not([data-${id}-observed])`,
        ).each((_, messageBlock) => {
          queueMicrotask(async () => {
            const { $answerHeading } = UiUtils.parseMessageBlock(
              $(messageBlock),
            );

            if (!$answerHeading.length) return;

            $(messageBlock).attr(`data-${id}-observed`, "true");

            const index = parseInt($(messageBlock).attr("data-index") ?? "0");

            const displayModelCode = (await webpageMessenger.sendMessage({
              event: "getReactNodeData",
              payload: {
                action: "getMessageDisplayModel",
                querySelector: `${DomHelperSelectors.THREAD.MESSAGE.BLOCK}[data-index="${index}"]`,
              },
              timeout: 5000,
            })) as ReactNodeActionReturnType["getMessageDisplayModel"];

            if (!displayModelCode) return;

            const displayModelName = languageModels.find(
              (x) => x.code === displayModelCode,
            )?.label;

            setTimeout(
              () => {
                $answerHeading
                  .find('div:contains("Answer"):last')
                  .text(
                    displayModelName
                      ? displayModelName.toUpperCase()
                      : `code: ${displayModelCode}`,
                  )
                  .addClass(
                    "!tw-font-mono !tw-text-xs tw-p-1 tw-px-2 tw-rounded-md tw-border tw-border-border tw-animate-in tw-fade-in",
                  );
              },
              $(messageBlock).find(DomSelectors.THREAD.MESSAGE.BOTTOM_BAR)
                .length
                ? 0
                : 500,
            );
          });
        });
      }

      return () => {
        DomObserver.destroy(id);
      };
    },
    [messagesContainer],
  );

  useEffect(
    function markdownQueryObserver() {
      if (!isDomNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = "alter-message-query";

      DomObserver.create(id, {
        target: messagesContainer,
        config: {
          childList: true,
          subtree: true,
        },
        debounceTime: 200,
        source: "hook",
        onAny: callback,
      });

      async function callback() {
        const $messageBlocks = $(
          `${DomHelperSelectors.THREAD.MESSAGE.BLOCK}:not([data-${id}])`,
        );

        $messageBlocks.each((_, messageBlock) => {
          queueMicrotask(() => {
            const $messageBlock = $(messageBlock);
            $messageBlock.attr(`data-${id}`, "");

            const $query = $messageBlock.find(".my-md.md\\:my-lg");

            rewriteQuery({ $query });
          });
        });
      }

      async function rewriteQuery({ $query }: { $query: JQuery<Element> }) {
        const mardownedText = markdown2Html($query.text());

        const textSize = $query
          .find(
            `>*:not(${
              DomHelperSelectors.THREAD.MESSAGE.TEXT_COL_CHILD.MARKDOWN_QUERY
            })`,
          )
          .attr("class")
          ?.split(" ")
          .find((c) => c === "text-3xl" || c === "text-base");

        const $newQueryWrapper = $("<div>")
          .html(mardownedText)
          .addClass(
            "markdown-query-wrapper prose dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word] default font-display dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection dark:selection " +
              textSize,
          );

        $query.append($newQueryWrapper);
      }

      return () => {
        DomObserver.destroy(id);
      };
    },
    [messagesContainer],
  );
}
