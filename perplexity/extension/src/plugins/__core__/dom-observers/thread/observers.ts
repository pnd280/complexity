import { isMobileStore } from "@/hooks/is-mobile-store";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import { threadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

export function observeNavbar({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.THREAD.NAVBAR,
    onAdd: (node) => {
      const $navbar = $(node as HTMLElement);

      if (!$navbar.length) return;

      $navbar.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.THREAD.NAVBAR,
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
    selector: `${DomSelectorsService.Root.cachedSync.THREAD.NAVBAR} ${
      DomSelectorsService.Root.cachedSync.SICKY_NAVBAR_CHILD
        .OVERFLOW_MENU_BUTTON_WRAPPER
    }`,
    onAdd: (node) => {
      const $overflowMenuButtonWrapper = $(node as HTMLElement);

      if (!$overflowMenuButtonWrapper.length) return;

      $overflowMenuButtonWrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.THREAD.NAVBAR_CHILD
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
    selector: DomSelectorsService.Root.cachedSync.THREAD.WRAPPER,
    onAdd: (node) => {
      const $wrapper = $(node as HTMLElement);

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.THREAD.WRAPPER,
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
    ? DomSelectorsService.Root.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.MOBILE
        .NORMAL
    : DomSelectorsService.Root.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.DESKTOP
        .NORMAL;

  if (!selector.length) {
    selector = isMobile
      ? DomSelectorsService.Root.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.MOBILE
          .BRANCHED
      : DomSelectorsService.Root.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
          .DESKTOP.BRANCHED;
  }

  return domObserverService.subscribe({
    id: observerId,
    selector,
    onAdd: (node) => {
      const $messageBlocksWrapper = $(node as HTMLElement);

      if (!$messageBlocksWrapper.length) return;

      $messageBlocksWrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.THREAD
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
