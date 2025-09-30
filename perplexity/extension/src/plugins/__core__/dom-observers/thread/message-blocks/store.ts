import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { MessageBlock } from "@/plugins/__core__/dom-observers/thread/message-blocks/types";

type ThreadMessageBlocksDomObserverStoreType = {
  messageBlocks: MessageBlock[] | null;
  resetStore: () => void;
};

export const threadMessageBlocksDomObserverStore =
  createWithEqualityFn<ThreadMessageBlocksDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
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
