import { findCodeBlocks } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/parser";
import { threadCodeBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/store";
import { threadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:thread:codeBlocks": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:thread:codeBlocks",
    dependencies: [
      "corePlugin:domObservers:thread:messageBlocks",
      "cache:pluginsEnableStates",
    ],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["domObservers:thread:codeBlocks"]) return;

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

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") return;

    threadCodeBlocksDomObserverStore.setState({
      codeBlocksChunks: await findCodeBlocks(
        threadMessageBlocksDomObserverStore.getState().messageBlocks ?? [],
      ),
    });
  });
}
