import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import { findCodeBlocks } from "@/plugins/__core__/dom-observers/thread/code-blocks/parser";
import { threadCodeBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/code-blocks/store";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { threadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

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

  threadDomObserverStore.subscribe(
    (store) => store.$messageBlocksWrapper,
    ($threadMessageBlocksWrapper) => {
      domObserverService.unsubscribe(
        createDomObserverId("thread", "codeBlocks"),
      );
      threadCodeBlocksDomObserverStore.getState().resetStore();

      if (
        $threadMessageBlocksWrapper == null ||
        !$threadMessageBlocksWrapper[0]
      ) {
        return;
      }

      domObserverService.subscribe({
        id: createDomObserverId("thread", "codeBlocks"),
        selector: [
          `${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.ANSWER} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.CODE_BLOCK.WRAPPER}`,
          `${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.ANSWER} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.CODE_BLOCK.WRAPPER} *`,
        ],
        onAdd: debounce(
          async () => {
            console.log("here");

            if (document.visibilityState === "visible") return;

            threadCodeBlocksDomObserverStore.setState({
              codeBlocksChunks: await findCodeBlocks(
                threadMessageBlocksDomObserverStore.getState().messageBlocks ??
                  [],
              ),
            });
          },
          1000,
          { leading: false, trailing: true },
        ),
        existingCheck: true,
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}
