import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SidebarDomObserverStoreType = {
  wrapper: HTMLElement | null;
  mobileTrigger: HTMLElement | null;
  menu: HTMLElement | null;
  resetStore: () => void;
};

export const sidebarDomObserverStore =
  createWithEqualityFn<SidebarDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SidebarDomObserverStoreType => ({
          wrapper: null,
          mobileTrigger: null,
          menu: null,
          resetStore: () => {
            set({
              wrapper: null,
              mobileTrigger: null,
              menu: null,
            });
          },
        }),
      ),
    ),
  );

export const useSidebarDomObserverStore = sidebarDomObserverStore;
