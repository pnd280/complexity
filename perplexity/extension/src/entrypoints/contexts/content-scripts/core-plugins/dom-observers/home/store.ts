import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

type HomeDomObserverStoreType = {
  slogan: HTMLElement | null;
  resetStore: () => void;
};

export const homeDomObserverStore =
  createWithEqualityFn<HomeDomObserverStoreType>()(
    subscribeWithSelector(
      mutative(
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
