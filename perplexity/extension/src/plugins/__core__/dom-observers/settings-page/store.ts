import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SettingsPageDomObserverStoreType = {
  sidebarWrapper: HTMLElement | null;
  resetStore: () => void;
};

export const settingsPageDomObserverStore =
  createWithEqualityFn<SettingsPageDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
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
