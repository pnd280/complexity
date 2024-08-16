import $ from "jquery";
import {
  Ellipsis,
  ListOrdered,
  LucideThumbsDown,
  Share2,
  X,
} from "lucide-react";

import { Container } from "@/content-script/components/ThreadMessageStickyToolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import { DomSelectors } from "@/utils/DomSelectors";
import { waitForElement } from "@/utils/utils";

type MiscMenuProps = {
  containers: Container[];
  containerIndex: number;
  isMessageShareable: boolean;
  isMessageEditable: boolean;
  $messageShareButton: JQuery<HTMLElement>;
};

export default function MiscMenu({
  containers,
  containerIndex,
  isMessageShareable,
  isMessageEditable,
  $messageShareButton,
}: MiscMenuProps) {
  return (
    <DropdownMenu
      positioning={{
        placement: "bottom-end",
      }}
    >
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
              triggerMenuItem({
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
              triggerMenuItem({
                container: containers[containerIndex],
                item: "Report",
              });
            }}
          >
            <LucideThumbsDown className="tw-size-4" />
            Report
          </DropdownMenuItem>
        )}

        {containers.length - 1 === containerIndex && containers.length > 1 && (
          <DropdownMenuItem
            value="delete"
            className="tw-flex tw-items-center tw-gap-2"
            onClick={() => {
              triggerMenuItem({
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
  );
}

function triggerMenuItem({
  container,
  item,
}: {
  container: Container;
  item: "Report" | "Delete" | "View Sources";
}) {
  return new Promise<void>((resolve) => {
    const $buttonBar = $(container.messageBlock).find(
      DomSelectors.THREAD.MESSAGE.BOTTOM_BAR,
    );

    const $button = $buttonBar
      .children()
      .last()
      .children()
      .find('button:has([data-icon="ellipsis"])');

    if (!$button.length) return resolve();

    $button.trigger("click");

    requestAnimationFrame(async () => {
      const viewportWidth = window.innerWidth;

      await waitForElement({
        selector() {
          if (viewportWidth && viewportWidth < 768) {
            return $(".duration-250.fill-mode-both.fixed.bottom-0.left-0")[0];
          }

          return $(
            `[data-popper-reference-hidden="true"]:contains("${item}")`,
          )[0];
        },
        timeout: 1000,
        interval: 100,
      });

      if (viewportWidth && viewportWidth < 768) {
        $(
          `.duration-250.fill-mode-both.fixed.bottom-0.left-0 .md\\:h-full:contains("${item}")`,
        )
          .last()
          .trigger("click");
      } else {
        $(
          `[data-popper-reference-hidden="true"] .md\\:h-full:contains("${item}")`,
        )
          .last()
          .trigger("click");
      }

      resolve();
    });
  });
}
