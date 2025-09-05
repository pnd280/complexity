import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type HomeDomObserverStoreType = {
  slogan: HTMLElement | null;
  resetStore: () => void;
};

export const homeDomObserverStore =
  createWithEqualityFn<HomeDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): HomeDomObserverStoreType => ({
          slogan: null,
          resetStore: () => {
            set({
              slogan: null,
            });
          },
        }),
      ),
    ),
  );

export const useHomeDomObserverStore = homeDomObserverStore;
