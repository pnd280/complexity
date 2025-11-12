import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import type { CodeBlock } from "@/plugins/__core__/dom-observers/thread/code-blocks/types";

type ThreadCodeBlocksDomObserverStoreType = {
  codeBlocksChunks: CodeBlock[][] | null;
  resetStore: () => void;
};

export const threadCodeBlocksDomObserverStore =
  createWithEqualityFn<ThreadCodeBlocksDomObserverStoreType>()(
    subscribeWithSelector(
      mutative(
        (set): ThreadCodeBlocksDomObserverStoreType => ({
          codeBlocksChunks: null,
          resetStore: () => {
            set({
              codeBlocksChunks: null,
            });
          },
        }),
      ),
    ),
  );

export const useThreadCodeBlocksDomObserverStore =
  threadCodeBlocksDomObserverStore;
