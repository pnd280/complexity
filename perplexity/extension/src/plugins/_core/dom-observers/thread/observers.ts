import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";

export function observePageWrapper({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: getDomSelectorsRootService().cachedSync.THREAD.PAGE_WRAPPER,
    onAdd: (node) => {
      const $pageWrapper = $(node as HTMLElement);

      if (!$pageWrapper.length) return;

      $pageWrapper.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.THREAD.PAGE_WRAPPER,
      );

      threadDomObserverStore.setState({
        $pageWrapper,
      });
    },
    onRemove: () => {
      threadDomObserverStore.setState({
        $pageWrapper: null,
      });
    },
    existingCheck: true,
  });
}

export function observeNavbar({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: getDomSelectorsRootService().cachedSync.THREAD.NAVBAR,
    onAdd: (node) => {
      const $navbar = $(node as HTMLElement);

      if (!$navbar.length) return;

      $navbar.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR,
      );

      threadDomObserverStore.setState({
        $navbar,
      });
    },
    onRemove: () => {
      threadDomObserverStore.setState({
        $navbar: null,
      });
    },
    existingCheck: true,
  });
}

export function observeNavbarOverflowMenuButtonWrapper({
  observerId,
}: {
  observerId: string;
}) {
  return domObserverService.subscribe({
    id: observerId,
    selector: `${getDomSelectorsRootService().cachedSync.THREAD.NAVBAR} ${
      getDomSelectorsRootService().cachedSync.SICKY_NAVBAR_CHILD
        .OVERFLOW_MENU_BUTTON_WRAPPER
    }`,
    onAdd: (node) => {
      const $overflowMenuButtonWrapper = $(node as HTMLElement);

      if (!$overflowMenuButtonWrapper.length) return;

      $overflowMenuButtonWrapper.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR_CHILD
          .OVERFLOW_MENU_BUTTON_WRAPPER,
      );

      threadDomObserverStore.setState({
        $overflowMenuButtonWrapper,
      });
    },
    onRemove: () => {
      threadDomObserverStore.setState({
        $overflowMenuButtonWrapper: null,
      });
    },
    existingCheck: true,
  });
}

export function observeWrapper({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: getDomSelectorsRootService().cachedSync.THREAD.WRAPPER,
    onAdd: (node) => {
      const $wrapper = $(node as HTMLElement);

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.THREAD.WRAPPER,
      );

      threadDomObserverStore.setState({
        $wrapper,
      });
    },
    onRemove: () => {
      threadDomObserverStore.setState({
        $wrapper: null,
      });
    },
    existingCheck: true,
  });
}

export function observeMessageBlocksWrapper({
  observerId,
}: {
  observerId: string;
}) {
  const isMobile = isMobileStore.getState().isMobile;

  let selector = isMobile
    ? getDomSelectorsRootService().cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
        .MOBILE.NORMAL
    : getDomSelectorsRootService().cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
        .DESKTOP.NORMAL;

  if (!selector.length) {
    selector = isMobile
      ? getDomSelectorsRootService().cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
          .MOBILE.BRANCHED
      : getDomSelectorsRootService().cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
          .DESKTOP.BRANCHED;
  }

  return domObserverService.subscribe({
    id: observerId,
    selector,
    onAdd: (node) => {
      const $messageBlocksWrapper = $(node as HTMLElement);

      if (!$messageBlocksWrapper.length) return;

      $messageBlocksWrapper.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.THREAD
          .MESSAGE_BLOCKS_WRAPPER,
      );

      threadDomObserverStore.setState({
        $messageBlocksWrapper,
      });
    },
    onRemove: () => {
      threadDomObserverStore.setState({
        $messageBlocksWrapper: null,
      });
    },
    existingCheck: true,
  });
}
