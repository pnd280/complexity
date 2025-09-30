import { DomSelectorsService } from "@/plugins/__async-deps__/dom-selectors/service-init.loader";
import { settingsPageDomObserverStore } from "@/plugins/__core__/dom-observers/settings-page/store";
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
