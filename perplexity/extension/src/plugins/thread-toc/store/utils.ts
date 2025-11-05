import debounce from "lodash/debounce";

import type { MessageBlock } from "@/plugins/__core__/dom-observers/thread/message-blocks/types";
import { threadTocStore } from "@/plugins/thread-toc/store";
import type { TocItem } from "@/plugins/thread-toc/store/types";

const PANEL_PADDING = 64;
const PANEL_MARGIN = 32;
const DEFAULT_HEADER_HEIGHT = 53;
const MAX_PANEL_WIDTH = 300;
const MIN_PANEL_WIDTH = 230;

let activeId: number | null = null;
let topMostId: number | null = null;
let observer: IntersectionObserver | null = null;
let topMostObserver: IntersectionObserver | null = null;
let lastMessageBlocks: MessageBlock[] | null = null;
let pendingUpdate = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let currentTocItems: TocItem[] = [];
let currentThreadWrapper: HTMLElement | null = null;
let currentMessageBlocks: MessageBlock[] | null = null;

const createObservers = (() => {
  let cachedObserver: IntersectionObserver | null = null;
  let cachedTopMostObserver: IntersectionObserver | null = null;

  const getHeaderHeight = () => {
    return (
      parseInt(
        getComputedStyle(document.body).getPropertyValue("--header-height"),
      ) || DEFAULT_HEADER_HEIGHT
    );
  };

  const createIntersectionHandler = (
    callback: (id: number) => void,
  ): IntersectionObserverCallback => {
    return (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute("data-index");
          if (elementId) {
            callback(parseInt(elementId));
            break;
          }
        }
      }
    };
  };

  return (
    onIntersect: (id: number) => void,
    onTopMostIntersect: (id: number) => void,
  ) => {
    if (!cachedObserver) {
      cachedObserver = new IntersectionObserver(
        createIntersectionHandler(onIntersect),
        {
          threshold: 0,
          rootMargin: "-49% 0px -49% 0px",
        },
      );
    }

    if (!cachedTopMostObserver) {
      const headerHeight = getHeaderHeight();
      cachedTopMostObserver = new IntersectionObserver(
        createIntersectionHandler(onTopMostIntersect),
        {
          threshold: 0,
          rootMargin: `-${headerHeight + PANEL_MARGIN}px 0px -90% 0px`,
        },
      );
    }

    return {
      observer: cachedObserver,
      topMostObserver: cachedTopMostObserver,
    };
  };
})();

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (topMostObserver) {
    topMostObserver.disconnect();
    topMostObserver = null;
  }
};

const updateActiveItem = (id: number) => {
  if (activeId === id) return;

  activeId = id;

  threadTocStore.setState((state) => ({
    tocItems: state.tocItems.map((item) =>
      item.id === id
        ? { ...item, isActive: true }
        : item.isActive
          ? { ...item, isActive: false }
          : item,
    ),
  }));
};

const updateTopMostItem = (id: number) => {
  if (topMostId === id) return;

  topMostId = id;

  threadTocStore.setState((state) => ({
    tocItems: state.tocItems.map((item) =>
      item.id === id
        ? { ...item, isActiveTopMost: true }
        : item.isActiveTopMost
          ? { ...item, isActiveTopMost: false }
          : item,
    ),
  }));
};

const updateItems = (
  messageBlocks: MessageBlock[] | null,
  previousTocItems: TocItem[],
) => {
  if (!messageBlocks) return;

  cleanupObserver();

  const observers = createObservers(updateActiveItem, updateTopMostItem);
  observer = observers.observer;
  topMostObserver = observers.topMostObserver;

  const existingTitles = new Map(
    previousTocItems.map((item) => [item.id, item.title]),
  );

  const newItems = messageBlocks.map(
    ({ nodes: { $wrapper }, content: { title } }, idx: number) => {
      const element = $wrapper[0];
      if (element) {
        observer!.observe(element);
        topMostObserver!.observe(element);
      }

      const itemTitle =
        title.length > 0 ? title : (existingTitles.get(idx) ?? "");

      return {
        id: idx,
        title: itemTitle,
        element: $wrapper,
        isActive: idx === activeId,
        isActiveTopMost: idx === topMostId,
      };
    },
  );

  threadTocStore.setState({ tocItems: newItems });
};

const getActiveMessageBlockContentWrapper = (): HTMLElement | null => {
  if (currentTocItems.length === 0 || !currentMessageBlocks) {
    return null;
  }

  const activeMessageBlockId = currentTocItems.findIndex(
    (item) => item.isActiveTopMost,
  );
  const targetBlockId = activeMessageBlockId === -1 ? 0 : activeMessageBlockId;
  const messageBlock = currentMessageBlocks[targetBlockId];

  if (!messageBlock) {
    return null;
  }

  if (messageBlock.states.isVirtualized) {
    return currentMessageBlocks[0]?.nodes.$contentWrapper[0] ?? null;
  }

  return messageBlock.nodes.$contentWrapper[0] ?? null;
};

const calculatePanelPosition = debounce(
  () => {
    if (currentThreadWrapper == null || currentTocItems.length < 2) {
      threadTocStore.setState({ panelPosition: null });
      return;
    }

    const activeMessageBlockContentWrapper =
      getActiveMessageBlockContentWrapper();

    if (activeMessageBlockContentWrapper == null) {
      threadTocStore.setState({ panelPosition: null });
      return;
    }

    const threadContentWrapperOffsetRight =
      activeMessageBlockContentWrapper.offsetLeft +
      activeMessageBlockContentWrapper.offsetWidth;

    if (threadContentWrapperOffsetRight <= 0) {
      threadTocStore.setState({ panelPosition: null });
      return;
    }

    const availableSpace =
      currentThreadWrapper.offsetWidth -
      threadContentWrapperOffsetRight -
      PANEL_PADDING -
      PANEL_MARGIN;

    const panelWidth = Math.max(
      MIN_PANEL_WIDTH,
      Math.min(MAX_PANEL_WIDTH, availableSpace),
    );

    const panelRightEdge =
      threadContentWrapperOffsetRight + panelWidth + PANEL_PADDING;
    const isOverflowing = panelRightEdge > currentThreadWrapper.offsetWidth;

    threadTocStore.setState({
      panelPosition: {
        position: {
          left: threadContentWrapperOffsetRight + PANEL_MARGIN,
        },
        isOverflowing,
        width: isOverflowing ? MAX_PANEL_WIDTH : panelWidth,
      },
    });
  },
  150,
  { leading: true, trailing: true, maxWait: 1000 },
);

export const utils = {
  updateItems,
  calculatePanelPosition,
  setCurrentMessageBlocks: (blocks: MessageBlock[] | null) => {
    currentMessageBlocks = blocks;
  },
  setCurrentTocItems: (items: TocItem[]) => {
    currentTocItems = items;
  },
  setCurrentThreadWrapper: (wrapper: HTMLElement | null) => {
    currentThreadWrapper = wrapper;
  },
  getCurrentTocItems: () => currentTocItems,
  getLastMessageBlocks: () => lastMessageBlocks,
  setLastMessageBlocks: (blocks: MessageBlock[] | null) => {
    lastMessageBlocks = blocks;
  },
  getPendingUpdate: () => pendingUpdate,
  setPendingUpdate: (value: boolean) => {
    pendingUpdate = value;
  },
  getWindowWidth: () => windowWidth,
  getWindowHeight: () => windowHeight,
  setWindowWidth: (width: number) => {
    windowWidth = width;
  },
  setWindowHeight: (height: number) => {
    windowHeight = height;
  },
};
