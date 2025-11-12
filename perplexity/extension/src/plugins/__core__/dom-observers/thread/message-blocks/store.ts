import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import type { MessageBlock } from "@/plugins/__core__/dom-observers/thread/message-blocks/types";

type ThreadMessageBlocksDomObserverStoreType = {
  messageBlocks: MessageBlock[] | null;
  resetStore: () => void;
};

export const threadMessageBlocksDomObserverStore =
  createWithEqualityFn<ThreadMessageBlocksDomObserverStoreType>()(
    subscribeWithSelector(
      mutative(
        (set): ThreadMessageBlocksDomObserverStoreType => ({
          messageBlocks: null,
          resetStore: () => {
            set({
              messageBlocks: null,
            });
          },
        }),
      ),
    ),
  );

export const useThreadMessageBlocksDomObserverStore =
  threadMessageBlocksDomObserverStore;
