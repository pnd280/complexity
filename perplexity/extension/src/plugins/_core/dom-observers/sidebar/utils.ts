import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";

export function findSidebarWrapper() {
  const existingWrapper = sidebarDomObserverStore.getState().$wrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingWrapper,
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.SIDEBAR.WRAPPER,
      ),
    })
  )
    return;

  const $wrapper = $(DomSelectorsService.cachedSync.SIDEBAR.WRAPPER);

  if (!$wrapper.length) return;

  $wrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.SIDEBAR.WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $wrapper,
  });
}

export function findMobileTrigger() {
  const isMobile = isMobileStore.getState().isMobile;

  if (!isMobile) return;

  const existingMobileTrigger =
    sidebarDomObserverStore.getState().$mobileTrigger?.[0];

  if (
    isInternalNodeExists({
      node: existingMobileTrigger,
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.SIDEBAR.MOBILE_TRIGGER,
      ),
    })
  )
    return;

  const $mobileTrigger = $(
    DomSelectorsService.cachedSync.SIDEBAR.MOBILE_TRIGGER,
  );

  if (!$mobileTrigger.length) return;

  $mobileTrigger.internalComponentAttr(
    DomSelectorsService.internalAttributes.SIDEBAR.MOBILE_TRIGGER,
  );

  sidebarDomObserverStore.setState({
    $mobileTrigger,
  });
}
