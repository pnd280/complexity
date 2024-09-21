
import { PiNotePencil } from "react-icons/pi";
import { Updater } from "use-immer";

import {
  Container,
  ContainerStates,
} from "@/content-script/components/ThreadMessageStickyToolbar";
import CopyButton from "@/content-script/components/ThreadMessageStickyToolbar/CopyButton";
import FormatSwitch from "@/content-script/components/ThreadMessageStickyToolbar/FormatSwitch";
import MiscMenu from "@/content-script/components/ThreadMessageStickyToolbar/MiscMenu";
import RewriteDropdown from "@/content-script/components/ThreadMessageStickyToolbar/RewriteDropdown";
import ThreadTitle from "@/content-script/components/ThreadMessageStickyToolbar/ThreadTitle";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import { DomHelperSelectors, DomSelectors } from "@/utils/DomSelectors";
import { scrollToElement } from "@/utils/utils";

type ToolbarProps = {
  containerIndex: number;
  containers: Container[];
  containersStates: ContainerStates[];
  setContainersStates: Updater<ContainerStates[]>;
};

export default function Toolbar({
  containerIndex,
  containers,
  containersStates,
  setContainersStates,
}: ToolbarProps) {
  // TODO: prone to changes, needs refactoring
  const $messageEditButton = $(containers?.[containerIndex]?.messageBlock)
    .find(DomSelectors.THREAD.MESSAGE.BOTTOM_BAR)
    .children()
    .last()
    .children()
    .find('div:has([data-icon="pen-to-square"])');

  const isMessageEditable = !!$messageEditButton.length;

  const $messageShareButton = $(containers?.[containerIndex]?.messageBlock)
    .find(DomSelectors.THREAD.MESSAGE.BOTTOM_BAR)
    .children()
    .first()
    .children()
    .find('div:contains("Share"):last')
    .closest("button");

  const isMessageShareable = !!$messageShareButton.length;

  const isMessageDeletable =
    containers.length - 1 === containerIndex &&
    containers.length > 1 &&
    !$(DomSelectors.QUERY_BOX.FORK_BUTTON).length;

  return (
    <div
      className={cn(
        "thread-message-toolbar tw-flex tw-items-center tw-gap-2 tw-border-b tw-border-border tw-bg-background tw-px-2 tw-py-[.8rem]",
        {
          "tw-shadow-bottom-lg":
            containersStates[containerIndex].isQueryOutOfViewport,
        },
      )}
    >
      <div className="tw-flex tw-w-full tw-items-center tw-gap-2">
        <FormatSwitch
          containers={containers}
          containerIndex={containerIndex}
          containersStates={containersStates}
          setContainersStates={setContainersStates}
          $messageEditButton={$messageEditButton}
        />

        <ThreadTitle
          query={
            $(containers[containerIndex].query).find("textarea").text() ||
            $(containers[containerIndex].query)
              .find(
                `>*:not(${
                  DomHelperSelectors.THREAD.MESSAGE.TEXT_COL_CHILD
                    .MARKDOWN_QUERY
                }):not(.tw-sticky)`,
              )
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

        <MiscMenu
          containers={containers}
          containerIndex={containerIndex}
          isMessageEditable={isMessageEditable}
          isMessageShareable={isMessageShareable}
          isMessageDeletable={isMessageDeletable}
          $messageShareButton={$messageShareButton}
        />
      </div>
    </div>
  );
}
