import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";

export function findSidebarWrapper() {
  const existingWrapper = sidebarDomObserverStore.getState().$wrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingWrapper,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.SIDEBAR.WRAPPER,
      ),
    })
  )
    return;

  const $wrapper = $(getDomSelectorsRootService().cachedSync.SIDEBAR.WRAPPER);

  if (!$wrapper.length) return;

  $wrapper.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.SIDEBAR.WRAPPER,
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
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.SIDEBAR.MOBILE_TRIGGER,
      ),
    })
  )
    return;

  const $mobileTrigger = $(
    getDomSelectorsRootService().cachedSync.SIDEBAR.MOBILE_TRIGGER,
  );

  if (!$mobileTrigger.length) return;

  $mobileTrigger.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.SIDEBAR.MOBILE_TRIGGER,
  );

  sidebarDomObserverStore.setState({
    $mobileTrigger,
  });
}
