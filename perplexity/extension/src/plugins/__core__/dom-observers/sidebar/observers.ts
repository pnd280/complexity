import { isMobileStore } from "@/hooks/is-mobile-store";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import { sidebarDomObserverStore } from "@/plugins/__core__/dom-observers/sidebar/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

export function observeSidebarWrapper({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.SIDEBAR.WRAPPER,
    onAdd: (node) => {
      const $wrapper = $(node as HTMLElement);

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.SIDEBAR.WRAPPER,
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
    selector: DomSelectorsService.Root.cachedSync.SIDEBAR.MOBILE_TRIGGER,
    onAdd: (node) => {
      const $mobileTrigger = $(node as HTMLElement);

      if (!$mobileTrigger.length) return;

      $mobileTrigger.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.SIDEBAR.MOBILE_TRIGGER,
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
