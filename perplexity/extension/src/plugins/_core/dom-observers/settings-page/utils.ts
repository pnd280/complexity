import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";

export function findSidebar() {
  const existingSidebar =
    settingsPageDomObserverStore.getState().$sidebarWrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingSidebar,
      selector: getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.SETTINGS_PAGE
          .SIDEBAR_WRAPPER,
      ),
    })
  )
    return;

  const $sidebar = $(
    getDomSelectorsRootService().cachedSync.SETTINGS_PAGE.SIDEBAR_WRAPPER,
  );

  if (!$sidebar.length) return;

  $sidebar.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.SETTINGS_PAGE
      .SIDEBAR_WRAPPER,
  );

  settingsPageDomObserverStore.setState({
    $sidebarWrapper: $sidebar,
  });
}
