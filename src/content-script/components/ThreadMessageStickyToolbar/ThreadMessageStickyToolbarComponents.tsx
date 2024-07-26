import $ from "jquery";
import {
  Ellipsis,
  ListOrdered,
  LucideThumbsDown,
  Share2,
  Text,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FaMarkdown } from "react-icons/fa";
import { PiNotePencil } from "react-icons/pi";
import { Updater } from "use-immer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import { scrollToElement, sleep, stripHtml } from "@/utils/utils";

import CopyButton from "./CopyButton";
import RewriteDropdown from "./RewriteDropdown";
import { Container, ContainerStates } from "./ThreadMessageStickyToolbar";
import ThreadTitle from "./ThreadTitle";

type ThreadMessageStickyToolbarComponents = {
  containerIndex: number;
  containers: Container[];
  containersStates: ContainerStates[];
  setContainersStates: Updater<ContainerStates[]>;
};

export default function ThreadMessageStickyToolbarComponents({
  containerIndex,
  containers,
  containersStates,
  setContainersStates,
}: ThreadMessageStickyToolbarComponents) {
  const [markdownVisualDiff, setMarkdownVisualDiff] = useState(false);

  const handleVisualDiff = useCallback(() => {
    const markdownText = stripHtml(
      $(containers[containerIndex].query)
        .find(">#markdown-query-wrapper")
        .html(),
    );

    const originalText = stripHtml(
      $(containers[containerIndex].query)
        .find(">*:not(#markdown-query-wrapper)")
        .html(),
    );

    setMarkdownVisualDiff(
      !!markdownText.length &&
        !!originalText.length &&
        markdownText !== originalText,
    );
  }, [containerIndex, containers]);

  useEffect(() => {
    handleVisualDiff();
  }, [containersStates, handleVisualDiff]);

  // TODO: prone to changes, needs refactoring
  const $messageEditButton = $(containers?.[containerIndex]?.messageBlock)
    .find(".mt-sm.flex.items-center.justify-between")
    .children()
    .last()
    .children()
    .find('div:has([data-icon="pen-to-square"])');

  const isMessageEditable = !!$messageEditButton.length;

  const $messageShareButton = $(containers?.[containerIndex]?.messageBlock)
    .find(".mt-sm.flex.items-center.justify-between")
    .children()
    .first()
    .children()
    .find('div:contains("Share"):last')
    .closest("button");

  const isMessageShareable = !!$messageShareButton.length;

  return (
    <div
      className={cn(
        "thread-message-toolbar w-w-full tw-flex tw-items-center tw-gap-2 tw-border-b tw-border-border tw-bg-background tw-px-2 tw-py-[.8rem]",
        {
          "tw-shadow-bottom-lg":
            containersStates[containerIndex].isQueryOutOfViewport,
        },
      )}
    >
      <div className="tw-flex tw-w-full tw-items-center tw-gap-2">
        {!containersStates[containerIndex].isHidden &&
          !containersStates[containerIndex].isQueryOutOfViewport &&
          markdownVisualDiff && (
            <Tooltip
              content={
                containersStates[containerIndex].isMarkdown
                  ? "Convert Query to Plain Text"
                  : "Convert Query to Markdown"
              }
              positioning={{
                gutter: 15,
              }}
              className="tw-w-max"
            >
              <div
                className="tw-cursor-pointer tw-text-secondary-foreground tw-opacity-10 tw-transition-all tw-animate-in tw-fade-in tw-slide-in-from-top hover:tw-opacity-100 active:tw-scale-95"
                onClick={() => {
                  if (
                    $(containers[containerIndex].query).find("textarea").length
                  ) {
                    $messageEditButton.trigger("click");
                  }

                  setContainersStates((draft) => {
                    $(containers[containerIndex].query)
                      .find(".whitespace-pre-line.break-words")
                      .toggleClass(
                        "!tw-hidden",
                        !draft[containerIndex].isMarkdown,
                      );
                    $(containers[containerIndex].query)
                      .find("#markdown-query-wrapper")
                      .toggleClass(
                        "!tw-hidden",
                        draft[containerIndex].isMarkdown,
                      );
                    draft[containerIndex].isMarkdown =
                      !draft[containerIndex].isMarkdown;
                    scrollToElement(
                      $(containers[containerIndex].query as unknown as Element),
                      -60,
                    );
                  });
                }}
              >
                {containersStates[containerIndex].isMarkdown ? (
                  <FaMarkdown className="tw-size-4" />
                ) : (
                  <Text className="tw-size-4" />
                )}
              </div>
            </Tooltip>
          )}

        <ThreadTitle
          query={
            $(containers[containerIndex].query).find("textarea").text() ||
            $(containers[containerIndex].query)
              .find(">*:not(#markdown-query-wrapper):not(.tw-sticky)")
              .first()
              .text()
          }
          isOutOfViewport={
            containersStates[containerIndex].isQueryOutOfViewport
          }
          onClick={() => {
            scrollToElement($(containers[containerIndex].query), -60);
          }}
        />
      </div>

      <div
        className={cn("tw-ml-auto tw-flex tw-items-center tw-gap-2", {
          "tw-invisible tw-opacity-0":
            containersStates[containerIndex].isHidden,
        })}
      >
        {isMessageEditable && (
          <RewriteDropdown container={containers[containerIndex]} />
        )}

        <CopyButton
          container={containers[containerIndex]}
          containerIndex={containerIndex}
        />

        {isMessageEditable && (
          <Tooltip content="Edit Query">
            <div
              className="tw-group tw-cursor-pointer tw-rounded-md tw-p-1 tw-text-secondary-foreground tw-transition-all tw-animate-in tw-fade-in hover:tw-bg-secondary active:tw-scale-95"
              onClick={() => {
                $messageEditButton.trigger("click");
              }}
            >
              <PiNotePencil className="tw-size-4 tw-text-muted-foreground tw-transition-all group-hover:tw-text-foreground" />
            </div>
          </Tooltip>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className="tw-group tw-cursor-pointer tw-rounded-md tw-p-1 tw-text-secondary-foreground tw-transition-all tw-animate-in tw-fade-in hover:tw-bg-secondary active:tw-scale-95"
              onClick={() => {}}
            >
              <Ellipsis className="tw-size-4 tw-text-muted-foreground tw-transition-all group-hover:tw-text-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!!$(containers[containerIndex].messageBlock).find(
              '.mb-sm.flex.w-full.items-center.justify-between:contains("Sources")',
            ).length && (
              <DropdownMenuItem
                value="view-sources"
                className="tw-flex tw-items-center tw-gap-2"
                onClick={async () => {
                  moreMenuItemClick({
                    container: containers[containerIndex],
                    item: "View Sources",
                  });
                }}
              >
                <ListOrdered className="tw-size-4" />
                View Sources
              </DropdownMenuItem>
            )}

            {isMessageShareable && (
              <DropdownMenuItem
                value="share"
                className="tw-flex tw-items-center tw-gap-2"
                onClick={() => {
                  $messageShareButton.trigger("click");
                }}
              >
                <Share2 className="tw-size-4" />
                Share
              </DropdownMenuItem>
            )}

            {isMessageEditable && (
              <DropdownMenuItem
                value="report"
                className="tw-flex tw-items-center tw-gap-2"
                onClick={async () => {
                  moreMenuItemClick({
                    container: containers[containerIndex],
                    item: "Report",
                  });
                }}
              >
                <LucideThumbsDown className="tw-size-4" />
                Report
              </DropdownMenuItem>
            )}

            {containers.length - 1 === containerIndex &&
              containers.length > 1 && (
                <DropdownMenuItem
                  value="delete"
                  className="tw-flex tw-items-center tw-gap-2"
                  onClick={async () => {
                    await moreMenuItemClick({
                      container: containers[containerIndex],
                      item: "Delete",
                    });
                  }}
                >
                  <X className="tw-size-4" />
                  Delete
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

async function moreMenuItemClick({
  container,
  item,
}: {
  container: Container;
  item: "Report" | "Delete" | "View Sources";
}) {
  const $buttonBar = $(container.messageBlock).find(
    ".mt-sm.flex.items-center.justify-between",
  );

  const $button = $buttonBar
    .children()
    .last()
    .children()
    .find('button:has([data-icon="ellipsis"])');

  if (!$button.length) return;

  $button.trigger("click");

  let acc = 0;

  while (
    !$(`[data-popper-reference-hidden="true"]:contains("${item}")`).length
  ) {
    await sleep(10);

    acc += 10;

    if (acc > 1000) return;
  }

  $(`[data-popper-reference-hidden="true"] .md\\:h-full:contains("${item}")`)
    .last()
    .trigger("click");
}
