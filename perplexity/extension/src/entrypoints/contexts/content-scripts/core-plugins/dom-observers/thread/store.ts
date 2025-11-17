import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

type ThreadDomObserverStoreType = {
  $navbar: JQuery<HTMLElement> | null;
  $overflowMenuButtonWrapper: JQuery<HTMLElement> | null;
  $wrapper: JQuery<HTMLElement> | null;
  $messageBlocksWrapper: JQuery<HTMLElement> | null;
  states: {
    isInFlight: boolean; // >= 1 message is in-flight
  };
  resetStore: () => void;
};

export const threadDomObserverStore =
  createWithEqualityFn<ThreadDomObserverStoreType>()(
    subscribeWithSelector(
      mutative(
        (set): ThreadDomObserverStoreType => ({
          $navbar: null,
          $overflowMenuButtonWrapper: null,
          $wrapper: null,
          $messageBlocksWrapper: null,
          states: {
            isInFlight: false,
          },
          resetStore: () => {
            set({
              $navbar: null,
              $overflowMenuButtonWrapper: null,
              $wrapper: null,
              $messageBlocksWrapper: null,
              states: {
                isInFlight: false,
              },
            });
          },
        }),
      ),
    ),
  );

export const useThreadDomObserverStore = threadDomObserverStore;
