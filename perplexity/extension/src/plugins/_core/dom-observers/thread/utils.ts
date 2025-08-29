import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";

export function findPageWrapper() {
  const existingPageWrapper =
    threadDomObserverStore.getState().$pageWrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingPageWrapper,
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.THREAD.PAGE_WRAPPER,
      ),
    })
  )
    return;

  const $pageWrapper = $(DomSelectorsService.cachedSync.THREAD.PAGE_WRAPPER);

  $pageWrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.PAGE_WRAPPER,
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
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.THREAD.NAVBAR,
      ),
    })
  )
    return;

  const $navbar = $(DomSelectorsService.cachedSync.THREAD.NAVBAR);

  if (!$navbar.length) return;

  $navbar.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.NAVBAR,
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
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.THREAD.NAVBAR_CHILD
          .OVERFLOW_MENU_BUTTON_WRAPPER,
      ),
    })
  )
    return;

  const $navbar = threadDomObserverStore.getState().$navbar;

  if (!$navbar || !$navbar[0]) return;

  const $overflowMenuButtonWrapper = $navbar.find(
    DomSelectorsService.cachedSync.SICKY_NAVBAR_CHILD
      .OVERFLOW_MENU_BUTTON_WRAPPER,
  );

  if (!$overflowMenuButtonWrapper[0]) {
    threadDomObserverStore.setState({
      $overflowMenuButtonWrapper: null,
    });

    return;
  }

  $overflowMenuButtonWrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.NAVBAR_CHILD
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
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.THREAD.WRAPPER,
      ),
    })
  )
    return;

  const $wrapper = $(DomSelectorsService.cachedSync.THREAD.WRAPPER);

  $wrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.WRAPPER,
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
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.THREAD.MESSAGE_BLOCKS_WRAPPER,
      ),
    })
  )
    return;

  const $messageBlocksWrapper = (() => {
    const isMobile = isMobileStore.getState().isMobile;

    let $target = $(
      isMobile
        ? DomSelectorsService.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.MOBILE
            .NORMAL
        : DomSelectorsService.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.DESKTOP
            .NORMAL,
    );

    if (!$target.length) {
      $target = $(
        isMobile
          ? DomSelectorsService.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.MOBILE
              .BRANCHED
          : DomSelectorsService.cachedSync.THREAD.MESSAGE_BLOCKS_WRAPPER.DESKTOP
              .BRANCHED,
      );
    }

    return $target;
  })();

  $messageBlocksWrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE_BLOCKS_WRAPPER,
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
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.THREAD.POPPER.DESKTOP,
      ),
    })
  )
    return;

  const $popper = $(document.body).find(
    `>${DomSelectorsService.cachedSync.THREAD.POPPER.DESKTOP}`,
  );

  if (!$popper.length) return;

  $popper.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.POPPER.DESKTOP,
  );

  threadDomObserverStore.setState({
    $popper,
  });
}
