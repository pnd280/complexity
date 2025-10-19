import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { findCodeBlocks } from "@/plugins/__core__/dom-observers/thread/code-blocks/parser";
import { threadCodeBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/code-blocks/store";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:thread:codeBlocks": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:thread:codeBlocks",
    dependencies: [
      "corePlugin:domObservers:thread:messageBlocks",
      "cache:corePlugins:enableStates",
    ],
    loader: ({ "cache:corePlugins:enableStates": corePluginsEnableStates }) => {
      if (!corePluginsEnableStates["domObservers:thread:codeBlocks"]) return;

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
