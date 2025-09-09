import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";

export function observeSidebarWrapper({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: getDomSelectorsRootService().cachedSync.SIDEBAR.WRAPPER,
    onAdd: (node) => {
      const $wrapper = $(node as HTMLElement);

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.SIDEBAR.WRAPPER,
      );

      sidebarDomObserverStore.setState({
        wrapper: $wrapper[0],
      });
    },
    onRemove: () => {
      sidebarDomObserverStore.setState({
        wrapper: null,
      });
    },
    existingCheck: true,
  });
}

export function observeMobileTrigger({ observerId }: { observerId: string }) {
  const isMobile = isMobileStore.getState().isMobile;

  if (!isMobile) return () => {};

  return domObserverService.subscribe({
    id: observerId,
    selector: getDomSelectorsRootService().cachedSync.SIDEBAR.MOBILE_TRIGGER,
    onAdd: (node) => {
      const $mobileTrigger = $(node as HTMLElement);

      if (!$mobileTrigger.length) return;

      $mobileTrigger.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.SIDEBAR.MOBILE_TRIGGER,
      );

      sidebarDomObserverStore.setState({
        mobileTrigger: $mobileTrigger[0],
      });
    },
    onRemove: () => {
      sidebarDomObserverStore.setState({
        mobileTrigger: null,
      });
    },
    existingCheck: true,
  });
}
