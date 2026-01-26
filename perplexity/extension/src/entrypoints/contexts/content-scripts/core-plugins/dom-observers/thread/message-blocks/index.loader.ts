import debounce from "lodash/debounce";

import { threadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:thread:messageBlocks": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:thread:messageBlocks",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["domObservers:thread:messageBlocks"]) return;
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

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") return;

    void onMutation();
  });
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
