import { useDebounce, useWindowSize } from "@uidotdev/usehooks";

import { usePplxCookiesStore } from "@/plugins/__async-deps__/global-stores/pplx-cookies-store";
import { useSpaRouter } from "@/plugins/__core__/_main-world/spa-router/utils";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import type { TocItem } from "@/plugins/thread-toc/useThreadTocItems";

export const PANEL_WIDTH = 300;

type PanelPosition = {
  position: { left: number };
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

  const activeMessageBlockContentWrapper =
    useThreadMessageBlocksDomObserverStore((store) => {
      const messageBlock = store.messageBlocks?.[activeMessageBlockId];

      if (messageBlock == null) return null;

      if (messageBlock.states.isVirtualized)
        return store.messageBlocks?.[0]?.nodes.$contentWrapper[0];

      return messageBlock.nodes.$contentWrapper[0];
    }, deepEqual);

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    void (isSidebarPinned && windowSize != null && url != null);

    if (threadWrapper == null || activeMessageBlockContentWrapper == null) {
      return null;
    }

    const threadContentWrapperOffsetRight =
      activeMessageBlockContentWrapper.offsetLeft +
      activeMessageBlockContentWrapper.offsetWidth;

    const panelRightEdge = threadContentWrapperOffsetRight + PANEL_WIDTH + 64;

    return {
      position: {
        left: threadContentWrapperOffsetRight + 32,
      },
      isOverflowing: panelRightEdge > threadWrapper.offsetWidth,
    };
  }, [
    isSidebarPinned,
    activeMessageBlockContentWrapper,
    threadWrapper,
    url,
    windowSize,
  ]);

  return calculatePosition();
}
