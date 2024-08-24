import {
  useDebounce,
  useWindowScroll,
  useWindowSize,
} from "@uidotdev/usehooks";
import $ from "jquery";
import { throttle } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

import { AnchorProps } from "@/content-script/components/ThreadToc";
import useRouter from "@/content-script/hooks/useRouter";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { DomHelperSelectors } from "@/utils/DomSelectors";
import UiUtils from "@/utils/UiUtils";
import { scrollToElement } from "@/utils/utils";

// TODO: refactor to use IntersectionObserver

export default function useThreadTocObserver() {
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
        top: $messagesContainer.offset()?.top ?? 0,
        left:
          $messagesContainer.width()! +
          ($messagesContainer.offset()?.left ?? 0),
      });
    }

    setAnchorsProps([]);

    $messageBlocks.forEach(({ $query, $answer, $messageBlock }) => {
      queueMicrotask(() => {
        const title =
          $query.find("textarea").val() ||
          $query
            .find(
              `>*:not(${DomHelperSelectors.THREAD.MESSAGE.TEXT_COL_CHILD.MARKDOWN_QUERY}):not(.tw-sticky)`,
            )
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
              CplxUserSettings.get().generalSettings.qolTweaks
                .threadMessageStickyToolbar;

            const isScrollingUp =
              ($answer.offset()?.top ?? 0) <= $(window).scrollTop()!;

            const offset =
              isScrollingUp && threadMessageStickyToolbar ? -110 : -60;

            scrollToElement($answer, offset);
          },
        } as AnchorProps;

        setAnchorsProps((prev) => [...(prev || []), anchorProps]);
      });
    });
  }, [isCanvasOpen]);

  const throttledObserver = useRef(throttle(myObserver, 50)).current;

  useEffect(() => {
    requestIdleCallback(() => throttledObserver());
  }, [url, isCanvasOpen, wndSize, scrollY, throttledObserver]);

  return { visibleMessageIndex, anchorsProps, wrapperPos };
}
