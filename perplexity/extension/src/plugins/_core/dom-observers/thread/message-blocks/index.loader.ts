import debounce from "lodash/debounce";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/plugins/_core/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

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

function observeThreadMessageBlocks() {
  threadDomObserverStore.subscribe(
    (store) => store.$messageBlocksWrapper,
    ($threadMessageBlocksWrapper) => {
      domObserverService.unsubscribe(
        createDomObserverId("thread", "messageBlocks"),
      );

      if (
        $threadMessageBlocksWrapper == null ||
        !$threadMessageBlocksWrapper[0]
      ) {
        threadMessageBlocksDomObserverStore.getState().resetStore();
        return;
      }

      domObserverService.subscribe({
        id: createDomObserverId("thread", "messageBlocks"),
        selector: [
          `${getDomSelectorsRootService().cplxAttribute(
            getDomSelectorsRootService().internalAttributes.THREAD
              .MESSAGE_BLOCKS_WRAPPER,
          )} ${getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.QUERY_WRAPPER} *`,
          `${getDomSelectorsRootService().cplxAttribute(
            getDomSelectorsRootService().internalAttributes.THREAD
              .MESSAGE_BLOCKS_WRAPPER,
          )} ${getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.ANSWER} ${getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.ANSWER_TEXT_CONTENT} *`,
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

const onMutation = debounce(async () => {
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

  threadMessageBlocksDomObserverStore.setState({
    messageBlocks,
  });
}, 100);

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
  onMutation();
}, 100);
