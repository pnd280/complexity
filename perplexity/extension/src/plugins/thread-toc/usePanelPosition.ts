import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";

import { DomObserver } from "@/plugins/_core/dom-observers/_service";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_core/dom-observers/_service/callback-queue";
import { createDomObserverId } from "@/plugins/_core/dom-observers/_service/types";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { useSpaRouter } from "@/plugins/_core/main-world/spa-router/utils";

export const PANEL_WIDTH = 230;

type PanelPosition = {
  position: { top: number; left: number };
  isOverflowing: boolean;
};

export function usePanelPosition(): PanelPosition | null {
  const { url } = useSpaRouter();
  const windowSize = useDebounce(useWindowSize(), 200);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(
    null,
  );
  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const threadContentWrapper = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[0]?.nodes.$query[0],
    deepEqual,
  );

  const calculatePosition = useCallback(() => {
    if (threadWrapper == null || threadContentWrapper == null) return null;

    const $threadWrapper = $(threadWrapper);
    const $children = $threadWrapper.children();

    const $firstChild = $children.first();
    const threadWrapperOffset = $firstChild.offset();
    if (!threadWrapperOffset) return null;

    const navbarHeightStr =
      document.body.style.getPropertyValue("--header-height");
    const navbarHeight = navbarHeightStr ? parseInt(navbarHeightStr) : 53;

    let threadContentWrapperWidth = threadContentWrapper.offsetWidth ?? 0;

    const validChildren = $children.filter((index, child) => {
      return index > 0 && !child.classList.contains("fixed");
    });

    if (validChildren.length > 0) threadContentWrapperWidth += 32;

    validChildren.each((_, child) => {
      const width = $(child).width();
      if (width != null) threadContentWrapperWidth += width;
    });

    if (threadContentWrapperWidth === 0) return null;

    const threadContentWrapperOffset =
      threadContentWrapper.getBoundingClientRect();

    if (threadContentWrapperOffset == null) return null;

    const panelRightEdge =
      threadContentWrapperOffset.left +
      threadContentWrapperWidth +
      PANEL_WIDTH +
      32;

    return {
      position: {
        top: navbarHeight + 20,
        left: threadContentWrapperWidth + threadContentWrapperOffset.left + 28,
      },
      isOverflowing: panelRightEdge > window.innerWidth,
    };
  }, [threadContentWrapper, threadWrapper]);

  const pageWrapper = useThreadDomObserverStore(
    (store) => store.$pageWrapper?.[0],
    deepEqual,
  );

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      const newPanelPosition = calculatePosition();
      if (newPanelPosition == null) return;
      setPanelPosition(newPanelPosition);
    }, 100);

    debouncedUpdate();

    if (pageWrapper == null) return;

    DomObserver.create(createDomObserverId("thread", "tocSidebarObserver"), {
      target: pageWrapper,
      config: {
        attributes: true,
        attributeFilter: ["style"],
      },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          debouncedUpdate,
          createTaskId("thread", "tocSidebarObserver"),
        ),
    });

    return () => {
      debouncedUpdate.cancel();
      DomObserver.destroy(createDomObserverId("thread", "tocSidebarObserver"));
    };
  }, [calculatePosition, windowSize, url, pageWrapper]);

  return panelPosition;
}
