import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

type SidebarDomObserverStoreType = {
  wrapper: HTMLElement | null;
  mobileTrigger: HTMLElement | null;
  menu: HTMLElement | null;
  resetStore: () => void;
};

export const sidebarDomObserverStore =
  createWithEqualityFn<SidebarDomObserverStoreType>()(
    subscribeWithSelector(
      mutative(
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
