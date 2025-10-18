import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/plugins/__core__/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:thread:messageBlocks": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:thread:messageBlocks",
    dependencies: ["cache:corePlugins:enableStates"],
    loader: ({ "cache:corePlugins:enableStates": corePluginsEnableStates }) => {
      if (!corePluginsEnableStates["domObservers:thread:messageBlocks"]) return;
      observeThreadMessageBlocks();
    },
  });
}

function cleanup() {
  domObserverService.unsubscribe(
    createDomObserverId("thread", "messageBlocks"),
  );
  threadMessageBlocksDomObserverStore.getState().resetStore();
}

function observeThreadMessageBlocks() {
  threadDomObserverStore.subscribe(
    (store) => store.$messageBlocksWrapper,
    ($threadMessageBlocksWrapper) => {
      cleanup();

      if (
        $threadMessageBlocksWrapper == null ||
        !$threadMessageBlocksWrapper[0]
      ) {
        return;
      }

      domObserverService.subscribe({
        id: createDomObserverId("thread", "messageBlocks"),
        selector: [
          `${DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.THREAD
              .MESSAGE_BLOCKS_WRAPPER,
          )} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.QUERY_WRAPPER}`,
          `${DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.THREAD
              .MESSAGE_BLOCKS_WRAPPER,
          )} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.QUERY_WRAPPER} *`,
          `${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.ANSWER}`,
          `${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.ANSWER} *`,
        ],
        onAdd: onMutation,
        onRemove: onMutation,
        existingCheck: true,
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}

const onMutation = debounce(
  async () => {
    const $threadMessagesContainer =
      threadDomObserverStore.getState().$messageBlocksWrapper;

    if ($threadMessagesContainer == null) {
      return;
    }

    const messageBlocks = await findMessageBlocks($threadMessagesContainer);

    if (messageBlocks == null) return;

    let isAnyMessageBlockInFlight = false;

    for (const block of messageBlocks) {
      if (block.states.isInFlight) {
        isAnyMessageBlockInFlight = true;
        break;
      }
    }

    // prevent stale nodes when dom observer can no longer catch mutations
    if (isAnyMessageBlockInFlight) {
      setTimeout(() => {
        void onMutation();
      }, 100);
    }

    threadDomObserverStore.setState((store) => {
      store.states.isInFlight = isAnyMessageBlockInFlight;
    });

    threadMessageBlocksDomObserverStore.setState({
      messageBlocks,
    });
  },
  100,
  { leading: true, trailing: true },
);
