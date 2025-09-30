import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GlobalCssStoreRegistry {}

type GlobalCssStoreType = {
  cssEntries: Partial<
    Record<
      keyof GlobalCssStoreRegistry,
      { css: string; subscribers: Set<string> }
    >
  >;
  addedToDom: Set<keyof GlobalCssStoreRegistry>;
  registerCssEntry: (params: {
    id: keyof GlobalCssStoreRegistry;
    css: string;
  }) => void;
  subscribe: (params: {
    entryIds: (keyof GlobalCssStoreRegistry)[];
    subscriberId: string;
  }) => void;
  unsubscribe: (params: {
    entryIds: (keyof GlobalCssStoreRegistry)[];
    subscriberId: string;
  }) => void;
  markAddedToDom: (id: keyof GlobalCssStoreRegistry) => void;
  markRemovedFromDom: (id: keyof GlobalCssStoreRegistry) => void;
};

export const globalCssStore = createWithEqualityFn<GlobalCssStoreType>()(
  subscribeWithSelector(
    immer(
      (set): GlobalCssStoreType => ({
        cssEntries: {} as GlobalCssStoreType["cssEntries"],
        addedToDom: new Set<keyof GlobalCssStoreRegistry>(),
        registerCssEntry: ({ id, css }) => {
          set((state) => {
            state.cssEntries[id] = { css, subscribers: new Set() };
          });
        },
        subscribe: ({ entryIds, subscriberId }) => {
          set((state) => {
            for (const entryId of entryIds) {
              if (!state.cssEntries[entryId]) {
                console.error(
                  `Global CSS entry \`${entryId}\` is declared but not registered!`,
                );
                continue;
              }

              if (state.cssEntries[entryId].subscribers.has(subscriberId)) {
                continue;
              }

              state.cssEntries[entryId].subscribers.add(subscriberId);
            }
          });
        },
        unsubscribe: ({ entryIds, subscriberId }) => {
          set((state) => {
            for (const entryId of entryIds) {
              if (
                !state.cssEntries[entryId] ||
                !state.cssEntries[entryId].subscribers.has(subscriberId)
              ) {
                continue;
              }

              state.cssEntries[entryId].subscribers.delete(subscriberId);
            }
          });
        },
        markAddedToDom: (id) => {
          set((state) => {
            state.addedToDom.add(id);
          });
        },
        markRemovedFromDom: (id) => {
          set((state) => {
            state.addedToDom.delete(id);
          });
        },
      }),
    ),
  ),
);

export const useGlobalCssStore = globalCssStore;

export function isEntryActive({
  store,
  entryId,
}: {
  store?: GlobalCssStoreType;
  entryId: keyof GlobalCssStoreRegistry;
}) {
  const entryCount =
    (store ?? globalCssStore.getState()).cssEntries[entryId]?.subscribers
      .size ?? 0;

  return entryCount > 0;
}

export function useIsEntryActive(entryId: keyof GlobalCssStoreRegistry) {
  return useGlobalCssStore((store) => {
    const entryCount = store.cssEntries[entryId]?.subscribers.size ?? 0;

    return entryCount > 0;
  }, deepEqual);
}

export function useRegisteredGlobalCssEntry({
  entryIds,
  subscriberId,
  subscribe,
}: Parameters<GlobalCssStoreType["subscribe"]>[0] & {
  subscribe?: boolean;
}) {
  useEffect(() => {
    if (subscribe === false) {
      globalCssStore.getState().unsubscribe({ entryIds, subscriberId });

      return;
    }

    globalCssStore.getState().subscribe({ entryIds, subscriberId });

    return () => {
      globalCssStore.getState().unsubscribe({ entryIds, subscriberId });
    };
  }, [entryIds, subscribe, subscriberId]);
}
