import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";

export function observeSidebar({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector:
      getDomSelectorsRootService().cachedSync.SETTINGS_PAGE.SIDEBAR_WRAPPER,
    onAdd: (node) => {
      const $sidebar = $(node as HTMLElement);

      if (!$sidebar.length) return;

      if ($sidebar.internalComponentAttr()) return;

      domObserverService.pause();

      $sidebar.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.SETTINGS_PAGE
          .SIDEBAR_WRAPPER,
      );

      settingsPageDomObserverStore.setState({
        sidebarWrapper: $sidebar[0],
      });

      requestAnimationFrame(() => domObserverService.resume());
    },
    onRemove: () => {
      settingsPageDomObserverStore.setState({
        sidebarWrapper: null,
      });
    },
    existingCheck: true,
  });
}
