import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

type SettingsPageDomObserverStoreType = {
  sidebarWrapper: HTMLElement | null;
  resetStore: () => void;
};

export const settingsPageDomObserverStore =
  createWithEqualityFn<SettingsPageDomObserverStoreType>()(
    subscribeWithSelector(
      mutative(
        (set): SettingsPageDomObserverStoreType => ({
          sidebarWrapper: null,
          resetStore: () => {
            set({
              sidebarWrapper: null,
            });
          },
        }),
      ),
    ),
  );

export const useSettingsPageDomObserverStore = settingsPageDomObserverStore;
