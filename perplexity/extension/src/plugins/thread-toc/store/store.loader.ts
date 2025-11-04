import { pplxCookiesStore } from "@/plugins/__async-deps__/global-stores/pplx-cookies-store";
import { spaRouterStoreSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
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
    (state) => state.tocItems,
    (tocItems) => {
      utils.setCurrentTocItems(tocItems);
      const delay = utils.getDebounceDelay(tocItems.length);
      utils.debouncedCalculatePanelPosition(delay);
    },
    { equalityFn: deepEqual },
  );

  threadDomObserverStore.subscribe(
    (state) => state.$wrapper,
    ($wrapper) => {
      utils.setCurrentThreadWrapper($wrapper?.[0] ?? null);
      utils.calculatePanelPosition();
    },
    { equalityFn: deepEqual },
  );

  pplxCookiesStore.subscribe(
    (state) =>
      state.cookies.find((cookie) => cookie.name === "isSidebarPinned"),
    () => {
      utils.calculatePanelPosition();
    },
    { equalityFn: deepEqual },
  );

  spaRouterStoreSubscribe(
    (url) => url,
    () => {
      utils.calculatePanelPosition();
    },
  );

  const handleResize = () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (
      newWidth !== utils.getWindowWidth() ||
      newHeight !== utils.getWindowHeight()
    ) {
      utils.setWindowWidth(newWidth);
      utils.setWindowHeight(newHeight);

      const delay = utils.getDebounceDelay(utils.getCurrentTocItems().length);
      utils.debouncedCalculatePanelPosition(delay);
    }
  };

  window.addEventListener("resize", handleResize);
}
