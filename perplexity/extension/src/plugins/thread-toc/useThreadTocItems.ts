import { useSyncExternalStore } from "react";

import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import type { MessageBlock } from "@/plugins/__core__/dom-observers/thread/message-blocks/types";

export type TocItem = {
  id: number;
  title: string;
  element: JQuery<Element>;
  isActive?: boolean;
  isActiveTopMost?: boolean;
};

type TocStore = {
  items: TocItem[];
  activeId: number | null;
  topMostId: number | null;
  observer: IntersectionObserver | null;
  topMostObserver: IntersectionObserver | null;
};

const createObservers = (() => {
  let cachedObserver: IntersectionObserver | null = null;
  let cachedTopMostObserver: IntersectionObserver | null = null;

  return (
    onIntersect: (id: number) => void,
    onTopMostIntersect: (id: number) => void,
  ) => {
    if (!cachedObserver) {
      cachedObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const elementId = entry.target.getAttribute("data-index");
              if (elementId) {
                onIntersect(parseInt(elementId));
                break;
              }
            }
          }
        },
        {
          threshold: 0,
          rootMargin: "-49% 0px -49% 0px",
        },
      );
    }

    if (!cachedTopMostObserver) {
      const navbarHeight =
        parseInt(
          getComputedStyle(document.body).getPropertyValue("--header-height"),
        ) || 53;

      cachedTopMostObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const elementId = entry.target.getAttribute("data-index");
              if (elementId) {
                onTopMostIntersect(parseInt(elementId));
                break;
              }
            }
          }
        },
        {
          threshold: 0,
          rootMargin: `-${navbarHeight + 32}px 0px -90% 0px`,
        },
      );
    }

    return {
      observer: cachedObserver,
      topMostObserver: cachedTopMostObserver,
      cleanup: () => {
        if (cachedObserver) {
          cachedObserver.disconnect();
        }
        if (cachedTopMostObserver) {
          cachedTopMostObserver.disconnect();
        }
      },
    };
  };
})();

const createTocStore = () => {
  const state: TocStore = {
    items: [],
    activeId: null,
    topMostId: null,
    observer: null,
    topMostObserver: null,
  };

  const cleanupObserver = () => {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
    if (state.topMostObserver) {
      state.topMostObserver.disconnect();
      state.topMostObserver = null;
    }
  };

  let lastMessageBlocks: MessageBlock[] | null = null;
  let pendingUpdate = false;

  const listeners = new Set<() => void>();

  const getSnapshot = () => {
    const messageBlocks =
      threadMessageBlocksDomObserverStore.getState().messageBlocks;

    if (!pendingUpdate && !deepEqual(messageBlocks, lastMessageBlocks)) {
      lastMessageBlocks = messageBlocks;
      pendingUpdate = true;

      requestAnimationFrame(() => {
        updateItems(messageBlocks);
        pendingUpdate = false;
      });
    }

    return state.items;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    const unsubscribeMessageBlocks =
      threadMessageBlocksDomObserverStore.subscribe(
        ({ messageBlocks }) => messageBlocks,
        () => {
          const messageBlocks =
            threadMessageBlocksDomObserverStore.getState().messageBlocks;
          if (!deepEqual(messageBlocks, lastMessageBlocks)) {
            listener();
          }
        },
        { equalityFn: deepEqual },
      );

    return () => {
      listeners.delete(listener);
      unsubscribeMessageBlocks();
      cleanupObserver();
    };
  };

  const emitChanges = () => {
    if (listeners.size > 0) {
      listeners.forEach((listener) => listener());
    }
  };

  const updateActiveItem = (id: number) => {
    if (state.activeId === id) return;

    state.activeId = id;

    state.items = state.items.map((item) =>
      item.id === id
        ? { ...item, isActive: true }
        : item.isActive
          ? { ...item, isActive: false }
          : item,
    );

    emitChanges();
  };

  const updateTopMostItem = (id: number) => {
    if (state.topMostId === id) return;

    state.topMostId = id;

    state.items = state.items.map((item) =>
      item.id === id
        ? { ...item, isActiveTopMost: true }
        : item.isActiveTopMost
          ? { ...item, isActiveTopMost: false }
          : item,
    );

    emitChanges();
  };

  const updateItems = (messageBlocks: MessageBlock[] | null) => {
    if (!messageBlocks) return;

    cleanupObserver();

    const { observer, topMostObserver } = createObservers(
      updateActiveItem,
      updateTopMostItem,
    );

    state.observer = observer;
    state.topMostObserver = topMostObserver;

    const existingTitles = new Map(
      state.items.map((item) => [item.id, item.title]),
    );

    state.items = messageBlocks.map(
      ({ nodes: { $wrapper }, content: { title } }, idx: number) => {
        if ($wrapper[0]) {
          observer.observe($wrapper[0]);
          topMostObserver.observe($wrapper[0]);
        }

        const itemTitle =
          title.length > 0 ? title : (existingTitles.get(idx) ?? "");

        return {
          id: idx,
          title: itemTitle,
          element: $wrapper,
          isActive: idx === state.activeId,
          isActiveTopMost: idx === state.topMostId,
        };
      },
    );

    emitChanges();
  };

  return {
    subscribe,
    getSnapshot,
    getActiveItem: () => state.items.find((item) => item.isActive) || null,
  };
};

const tocStore = createTocStore();

export function useThreadTocItems() {
  return useSyncExternalStore(tocStore.subscribe, tocStore.getSnapshot);
}

export function useActiveThreadTocItem() {
  return tocStore.getActiveItem();
}
