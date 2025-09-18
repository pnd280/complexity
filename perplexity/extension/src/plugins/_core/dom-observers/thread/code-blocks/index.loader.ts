import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { findCodeBlocks } from "@/plugins/_core/dom-observers/thread/code-blocks/parser";
import { threadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { shouldEnableCoreDomObserver } from "@/plugins/_core/dom-observers/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    "thread:codeBlocks": void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:thread:codeBlocks": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:thread:codeBlocks",
    dependencies: [
      "coreDomObserver:thread:messageBlocks",
      "cache:pluginsStates",
    ],
    loader: () => {
      if (
        !shouldEnableCoreDomObserver({
          coreObserverId: "thread:codeBlocks",
        })
      )
        return;

      observeThreadCodeBlocks();
    },
  });
}

function observeThreadCodeBlocks() {
  threadMessageBlocksDomObserverStore.subscribe(
    (store) => store.messageBlocks,
    async (messageBlocks) => {
      if (messageBlocks == null) {
        threadCodeBlocksDomObserverStore.getState().resetStore();
        return;
      }

      threadCodeBlocksDomObserverStore.setState({
        codeBlocksChunks: await findCodeBlocks(messageBlocks),
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}
