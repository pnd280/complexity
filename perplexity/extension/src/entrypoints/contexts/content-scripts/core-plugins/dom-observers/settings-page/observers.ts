import { settingsPageDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/settings-page/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";

export function observeSidebar({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.SETTINGS_PAGE.SIDEBAR_WRAPPER,
    onAdd: (node) => {
      const $sidebar = $(node as HTMLElement);

      if (!$sidebar.length) return;

      $sidebar.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.SETTINGS_PAGE
          .SIDEBAR_WRAPPER,
      );

      settingsPageDomObserverStore.setState({
        sidebarWrapper: $sidebar[0],
      });
    },
    onRemove: () => {
      settingsPageDomObserverStore.setState({
        sidebarWrapper: null,
      });
    },
    existingCheck: true,
  });
}
