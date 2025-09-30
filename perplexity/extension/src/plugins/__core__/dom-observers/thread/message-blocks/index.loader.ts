import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { DomSelectorsService } from "@/plugins/__async-deps__/dom-selectors/service-init.loader";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/plugins/__core__/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

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
          `${DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.THREAD
              .MESSAGE_BLOCKS_WRAPPER,
          )} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.QUERY_WRAPPER} *`,
          `${DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.THREAD
              .MESSAGE_BLOCKS_WRAPPER,
          )} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.ANSWER} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.ANSWER_TEXT_CONTENT} *`,
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
