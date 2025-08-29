import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";

export function findSidebar() {
  const existingSidebar =
    settingsPageDomObserverStore.getState().$sidebarWrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingSidebar,
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.SETTINGS_PAGE.SIDEBAR_WRAPPER,
      ),
    })
  )
    return;

  const $sidebar = $(
    DomSelectorsService.cachedSync.SETTINGS_PAGE.SIDEBAR_WRAPPER,
  );

  if (!$sidebar.length) return;

  $sidebar.internalComponentAttr(
    DomSelectorsService.internalAttributes.SETTINGS_PAGE.SIDEBAR_WRAPPER,
  );

  settingsPageDomObserverStore.setState({
    $sidebarWrapper: $sidebar,
  });
}
