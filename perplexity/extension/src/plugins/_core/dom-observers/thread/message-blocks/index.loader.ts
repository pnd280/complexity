import debounce from "lodash/debounce";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { DomObserver } from "@/plugins/_core/dom-observers/_service";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_core/dom-observers/_service/callback-queue";
import { createDomObserverId } from "@/plugins/_core/dom-observers/_service/types";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/plugins/_core/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    "thread:messageBlocks": void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:thread:messageBlocks": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:thread:messageBlocks",
    dependencies: ["cache:pluginsStates"],
    loader: () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "thread:messageBlocks",
        })
      )
        return;

      observeThreadMessageBlocks();
    },
  });
}
function cleanup() {
  DomObserver.destroy(createDomObserverId("thread", "messageBlocks"));
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
      )
        return;

      DomObserver.create(createDomObserverId("thread", "messageBlocks"), {
        target: $threadMessageBlocksWrapper[0],
        config: { childList: true, subtree: true },
        onMutation,
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}

async function onMutation() {
  const $threadMessagesContainer =
    threadDomObserverStore.getState().$messageBlocksWrapper;

  if ($threadMessagesContainer == null) {
    return;
  }

  if (
    !hasContentChanged($threadMessagesContainer) &&
    threadMessageBlocksDomObserverStore.getState().messageBlocks != null
  ) {
    return;
  }

  const messageBlocks = await findMessageBlocks($threadMessagesContainer);

  if (messageBlocks == null) return;

  let isAnyMessageBlockInFlight = false;
  let isAnyMessageBlockVirtualized = false;

  for (const block of messageBlocks) {
    if (block.states.isInFlight) {
      isAnyMessageBlockInFlight = true;
    }
    if (block.states.isVirtualized) {
      isAnyMessageBlockVirtualized = true;
    }

    if (isAnyMessageBlockInFlight && isAnyMessageBlockVirtualized) {
      break;
    }
  }

  // in case the in-flight message is virtualized, no further DOM mutations will occur so we need to force trigger the observer
  if (isAnyMessageBlockInFlight && isAnyMessageBlockVirtualized) {
    scheduleObserverForceTrigger();
  }

  threadDomObserverStore.setState((store) => {
    store.states.isInFlight = isAnyMessageBlockInFlight;
  });

  CallbackQueue.getInstance().enqueue(
    async () => {
      threadMessageBlocksDomObserverStore.setState({
        messageBlocks,
      });
    },
    createTaskId("thread", "messageBlocks"),
  );
}

function hasContentChanged($threadMessagesContainer: JQuery<HTMLElement>) {
  const prevTextContent =
    $threadMessagesContainer.data("prevTextContent") ?? "";
  const currentTextContent = $threadMessagesContainer[0]?.textContent ?? "";

  const result = prevTextContent !== currentTextContent;

  if (result) {
    $threadMessagesContainer.data("prevTextContent", currentTextContent);
  }

  return result;
}

const scheduleObserverForceTrigger = debounce(() => {
  DomObserver.forceTrigger(createDomObserverId("thread", "messageBlocks"));
}, 100);
