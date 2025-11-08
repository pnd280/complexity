import { PositionObserver } from "position-observer";

import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { threadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { threadTocStore } from "@/plugins/thread-toc/store";
import { utils } from "@/plugins/thread-toc/store/utils";
import { getTaskScheduler } from "@/utils/misc/utils";
import { deepEqual } from "@/utils/wrappers/deep-equal";

export default function () {
  threadMessageBlocksDomObserverStore.subscribe(
    ({ messageBlocks }) => messageBlocks,
    (messageBlocks) => {
      utils.setCurrentMessageBlocks(messageBlocks);

      if (
        !utils.getPendingUpdate() &&
        !deepEqual(messageBlocks, utils.getLastMessageBlocks())
      ) {
        utils.setLastMessageBlocks(messageBlocks);
        utils.setPendingUpdate(true);

        getTaskScheduler()(() => {
          utils.updateItems(messageBlocks, utils.getCurrentTocItems());
          utils.setPendingUpdate(false);
        });
      }
    },
    { equalityFn: deepEqual },
  );

  threadTocStore.subscribe(
    (store) => store.tocItems,
    (tocItems) => {
      utils.setCurrentTocItems(tocItems);
      utils.calculatePanelPosition();
    },
    { equalityFn: deepEqual },
  );

  const observer = new PositionObserver((_entries) => {
    utils.calculatePanelPosition();
  });

  threadDomObserverStore.subscribe(
    (store) => store.$wrapper,
    ($wrapper) => {
      utils.setCurrentThreadWrapper($wrapper?.[0] ?? null);
      utils.calculatePanelPosition();

      observer.disconnect();

      if ($wrapper == null) {
        return;
      }

      observer.observe($wrapper[0] as Element);
    },
    { equalityFn: deepEqual },
  );
}
