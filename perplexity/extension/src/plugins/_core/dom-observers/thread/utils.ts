import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";

export function findPageWrapper() {
  const existingPageWrapper =
    threadDomObserverStore.getState().$pageWrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingPageWrapper,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.PAGE_WRAPPER,
      ),
    })
  )
    return;

  const $pageWrapper = $(
    getDomSelectorsRootService().cachedSync.THREAD.PAGE_WRAPPER,
  );

  $pageWrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.PAGE_WRAPPER,
  );

  threadDomObserverStore.setState({
    $pageWrapper,
  });
}

export function findNavbar() {
  const existingNavbar = threadDomObserverStore.getState().$navbar?.[0];

  if (
    isInternalNodeExists({
      node: existingNavbar,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR,
      ),
    })
  )
    return;

  const $navbar = $(getDomSelectorsRootService().cachedSync.THREAD.NAVBAR);

  if (!$navbar.length) return;

  $navbar.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR,
  );

  threadDomObserverStore.setState({
    $navbar,
  });
}

export function findNavbarOverflowMenuButtonWrapper() {
  const existingOverflowMenuButtonWrapper =
    threadDomObserverStore.getState().$overflowMenuButtonWrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingOverflowMenuButtonWrapper,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR_CHILD
          .OVERFLOW_MENU_BUTTON_WRAPPER,
      ),
    })
  )
    return;

  const $navbar = threadDomObserverStore.getState().$navbar;

  if (!$navbar || !$navbar[0]) return;

  const $overflowMenuButtonWrapper = $navbar.find(
    getDomSelectorsRootService().cachedSync.SICKY_NAVBAR_CHILD
      .OVERFLOW_MENU_BUTTON_WRAPPER,
  );

  if (!$overflowMenuButtonWrapper[0]) {
    threadDomObserverStore.setState({
      $overflowMenuButtonWrapper: null,
    });

    return;
  }

  $overflowMenuButtonWrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.NAVBAR_CHILD
      .OVERFLOW_MENU_BUTTON_WRAPPER,
  );

  threadDomObserverStore.setState({
    $overflowMenuButtonWrapper,
  });
}

export function findWrapper() {
  const existingWrapper = threadDomObserverStore.getState().$wrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingWrapper,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.WRAPPER,
      ),
    })
  )
    return;

  const $wrapper = $(getDomSelectorsRootService().cachedSync.THREAD.WRAPPER);

  $wrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.WRAPPER,
  );

  threadDomObserverStore.setState({
    $wrapper,
  });
}

export function findMessageBlocksWrapper() {
  const existingWrapper =
    threadDomObserverStore.getState().$messageBlocksWrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingWrapper,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD
          .MESSAGE_BLOCKS_WRAPPER,
      ),
    })
  )
    return;

  const $messageBlocksWrapper = (() => {
    const isMobile = isMobileStore.getState().isMobile;

    let $target = $(
      isMobile
        ? getDomSelectorsRootService().cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
            .MOBILE.NORMAL
        : getDomSelectorsRootService().cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER
            .DESKTOP.NORMAL,
    );

    if (!$target.length) {
      $target = $(
        isMobile
          ? getDomSelectorsRootService().cachedSync.THREAD
              .MESSAGE_BLOCKS_WRAPPER.MOBILE.BRANCHED
          : getDomSelectorsRootService().cachedSync.THREAD
              .MESSAGE_BLOCKS_WRAPPER.DESKTOP.BRANCHED,
      );
    }

    return $target;
  })();

  $messageBlocksWrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD
      .MESSAGE_BLOCKS_WRAPPER,
  );

  threadDomObserverStore.setState({
    $messageBlocksWrapper,
  });
}

export function findPopper() {
  const existingPopper = threadDomObserverStore.getState().$popper?.[0];

  if (
    isInternalNodeExists({
      node: existingPopper,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.POPPER.DESKTOP,
      ),
    })
  )
    return;

  const $popper = $(document.body).find(
    `>${getDomSelectorsRootService().cachedSync.THREAD.POPPER.DESKTOP}`,
  );

  if (!$popper.length) return;

  $popper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.THREAD.POPPER.DESKTOP,
  );

  threadDomObserverStore.setState({
    $popper,
  });
}
