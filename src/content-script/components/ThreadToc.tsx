import {
  useDebounce,
  useToggle,
  useWindowScroll,
  useWindowSize,
} from "@uidotdev/usehooks";
import $ from "jquery";
import { ChevronLeft, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import useRouter from "@/content-script/hooks/useRouter";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import CplxUserSettings from "@/lib/CplxUserSettings";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import UiUtils from "@/utils/UiUtils";
import { scrollToElement } from "@/utils/utils";

export default function ThreadToc() {
  const { isOpen: isCanvasOpen } = useCanvasStore();

  const { visibleMessageIndex, anchorsProps, wrapperPos } =
    useThreadTocObserver();

  const [visible, toggleVisibility] = useToggle(true);

  const [wrapperWidth, setWrapperWidth] = useState<number>(
    $("#thread-toc")?.outerWidth() || 0,
  );

  const isFloat =
    isCanvasOpen ||
    (wrapperPos
      ? wrapperPos.left + wrapperWidth + 50 > window.innerWidth
      : false);

  useEffect(() => {
    isCanvasOpen && toggleVisibility(false);
  }, [isCanvasOpen, toggleVisibility]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setWrapperWidth($("#thread-toc")?.outerWidth() || 0);
    });
  });

  if (!anchorsProps || anchorsProps.length < 2 || !wrapperPos) return null;

  return (
    <div
      className="tw-fixed tw-right-0 tw-top-0 tw-z-20 tw-w-max tw-transition-all"
      style={{
        top: `${(UiUtils.getThreadWrapper().offset()?.top || 70) + (isFloat ? 60 : 30)}px`,
        [!isFloat ? "left" : "right"]: !isFloat
          ? `${wrapperPos.left + 20}px`
          : "2rem",
      }}
    >
      <div
        className={cn(
          "tw-font-sans tw-transition-all tw-animate-in tw-slide-in-from-right",
          {
            "tw-relative tw-rounded-md tw-border tw-border-border tw-bg-background tw-p-3 tw-shadow-lg":
              isFloat,
            "tw-hidden": !visible && isFloat,
          },
        )}
        id="thread-toc"
      >
        <div className="custom-scrollbar tw-flex tw-max-h-[50dvh] tw-min-w-[150px] tw-max-w-[250px] tw-flex-col tw-gap-1 tw-overflow-auto">
          {anchorsProps?.map((anchorProps, index) => (
            <div
              key={index}
              className={cn(
                "tw-group tw-flex tw-cursor-pointer tw-items-center tw-space-x-2 tw-text-sm",
                {
                  "tw-mr-6": visible && isFloat && index === 0,
                },
              )}
              onClick={anchorProps.onClick}
              onContextMenu={(e) => {
                e.preventDefault();
                anchorProps.onContextMenu();
              }}
            >
              <div
                className={cn(
                  "tw-h-5 tw-w-[.1rem] tw-rounded-md tw-bg-muted tw-transition-colors tw-duration-300 tw-ease-in-out",
                  {
                    "!tw-bg-accent-foreground": index === visibleMessageIndex,
                  },
                )}
              />
              <div
                className={cn(
                  "tw-w-full tw-cursor-pointer tw-select-none tw-truncate tw-text-foreground-darker tw-transition-colors tw-duration-300 tw-ease-in-out group-hover:tw-text-muted-foreground",
                  {
                    "!tw-text-foreground": index === visibleMessageIndex,
                  },
                )}
              >
                {anchorProps.title}
              </div>
            </div>
          ))}
        </div>
        {isFloat && visible && (
          <div
            className={cn(
              "tw-absolute tw-right-1 tw-top-1 tw-transition-colors tw-duration-300 active:tw-scale-95",
            )}
            onClick={() => {
              toggleVisibility(false);
            }}
          >
            <X className="tw-h-5 tw-w-5 tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:!tw-text-foreground" />
          </div>
        )}
      </div>
      <div
        className={cn(
          "tw-absolute -tw-right-10 -tw-top-2 tw-h-20 tw-cursor-pointer tw-rounded-full tw-border tw-border-border tw-bg-secondary tw-shadow-lg tw-transition-all tw-animate-in tw-slide-in-from-left active:tw-scale-95",
          "tw-flex tw-items-center hover:-tw-right-8",
          {
            "tw-hidden": !isFloat || visible,
          },
        )}
        onClick={() => {
          toggleVisibility(true);
        }}
      >
        <Tooltip
          content="Show Table of Content"
          positioning={{
            placement: "left",
          }}
        >
          <ChevronLeft className="tw-h-5 tw-w-5 tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:!tw-text-foreground" />
        </Tooltip>
      </div>
    </div>
  );
}

type AnchorProps = {
  title: string;
  onClick: () => void;
  onContextMenu: () => void;
};

const useThreadTocObserver = () => {
  const { url } = useRouter();

  const wndSize = useDebounce(useWindowSize(), 100);
  const [{ y: scrollY }] = useWindowScroll();

  const isCanvasOpen = useCanvasStore((state) => state.isOpen);

  const [visibleMessageIndex, setVisibleMessageIndex] = useState<number>(0);

  const [anchorsProps, setAnchorsProps] = useState<AnchorProps[]>();

  const [wrapperPos, setWrapperPos] = useState<{
    top: number;
    left: number;
  }>();

  const myObserver = useCallback(() => {
    const documentNotOverflowing = $(document).height()! <= $(window).height()!;

    if (documentNotOverflowing) return setAnchorsProps([]);

    setVisibleMessageIndex(
      UiUtils.getMostVisibleElementIndex(
        UiUtils.getMessagesContainer().children().toArray(),
      ),
    );

    const $messagesContainer = UiUtils.getMessagesContainer();
    const $messageBlocks = UiUtils.getMessageBlocks();

    if (!$messageBlocks.length || !$messagesContainer.length) return;

    if (!isCanvasOpen) {
      setWrapperPos({
        top: $messagesContainer.offset()?.top || 0,
        left:
          $messagesContainer.width()! +
          ($messagesContainer.offset()?.left || 0),
      });
    }

    setAnchorsProps([]);

    $messageBlocks.forEach(({ $query, $answer, $messageBlock }) => {
      queueMicrotask(() => {
        const title =
          $query.find("textarea").val() ||
          $query
            .find(">*:not(#markdown-query-wrapper):not(.tw-sticky)")
            .first()
            .text();

        if (!title.length) return;

        const anchorProps = {
          title,
          onClick: () => {
            scrollToElement($messageBlock, -10);
          },
          onContextMenu: () => {
            const threadMessageStickyToolbar =
              CplxUserSettings.get().popupSettings.qolTweaks
                .threadMessageStickyToolbar;

            const isScrollingUp =
              ($answer.offset()?.top || 0) <= $(window).scrollTop()!;

            const offset =
              isScrollingUp && threadMessageStickyToolbar ? -110 : -60;

            scrollToElement($answer, offset);
          },
        } as AnchorProps;

        setAnchorsProps((prev) => [...(prev || []), anchorProps]);
      });
    });
  }, [isCanvasOpen]);

  useEffect(() => {
    requestIdleCallback(() => myObserver());
  }, [url, isCanvasOpen, wndSize, scrollY, myObserver]);

  return { visibleMessageIndex, anchorsProps, wrapperPos };
};
