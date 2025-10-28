import { useDebounce, useWindowSize } from "@uidotdev/usehooks";

import { usePplxCookiesStore } from "@/plugins/__async-deps__/global-stores/pplx-cookies-store";
import { useSpaRouter } from "@/plugins/__core__/_main-world/spa-router/utils";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import type { TocItem } from "@/plugins/thread-toc/useThreadTocItems";

export const PANEL_WIDTH = 230;

type PanelPosition = {
  position: { top: number; left: number };
  isOverflowing: boolean;
};

export function usePanelPosition({
  tocItems,
}: {
  tocItems: TocItem[];
}): PanelPosition | null {
  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const activeMessageBlockId = tocItems.findIndex(
    (item) => item.isActiveTopMost,
  );

  const threadContentWrapper = useThreadMessageBlocksDomObserverStore(
    (store) =>
      store.messageBlocks?.[activeMessageBlockId]?.nodes.$contentWrapper[0],
    deepEqual,
  );

  const isSidebarPinned = usePplxCookiesStore(
    (store) =>
      store.cookies.find((cookie) => cookie.name === "isSidebarPinned")
        ?.value === "true",
    deepEqual,
  );

  const windowSize = useDebounce(
    useWindowSize(),
    tocItems.length > 5 ? 200 : 0,
  );

  const url = useSpaRouter((store) => store.url);

  const calculatePosition = useCallback(() => {
    void (isSidebarPinned && windowSize != null && url != null);

    if (threadWrapper == null) {
      return null;
    }

    const $threadWrapper = $(threadWrapper);
    const $children = $threadWrapper.children();

    const $firstChild = $children.first();
    const threadWrapperOffset = $firstChild.offset();
    if (!threadWrapperOffset) {
      console.log("threadWrapperOffset is null");
      return null;
    }

    const navbarHeightStr =
      document.body.style.getPropertyValue("--header-height");
    const navbarHeight = navbarHeightStr ? parseInt(navbarHeightStr) : 53;

    let threadContentWrapperWidth = threadContentWrapper?.offsetWidth ?? 0;

    const validChildren = $children.filter((index, child) => {
      return index > 0 && !child.classList.contains("fixed");
    });

    if (validChildren.length > 0) threadContentWrapperWidth += 32;

    validChildren.each((_, child) => {
      const width = $(child).width();
      if (width != null) threadContentWrapperWidth += width;
    });

    const threadContentWrapperOffsetLeft =
      threadContentWrapper?.getBoundingClientRect().left ?? 0;

    const panelRightEdge =
      threadContentWrapperOffsetLeft +
      threadContentWrapperWidth +
      PANEL_WIDTH +
      32;

    return {
      position: {
        top: navbarHeight + 20,
        left: threadContentWrapperWidth + threadContentWrapperOffsetLeft + 28,
      },
      isOverflowing:
        panelRightEdge > window.innerWidth ||
        threadContentWrapperOffsetLeft === 0,
    };
  }, [isSidebarPinned, threadContentWrapper, threadWrapper, url, windowSize]);

  return calculatePosition();
}
