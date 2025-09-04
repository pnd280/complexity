import { sendMessage } from "webext-bridge/content-script";

import Cplx from "@/components/icons/Cplx";
import FaArrowUpRight from "@/components/icons/FaArrowUpRight";
import { Portal } from "@/components/ui/portal";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useSettingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";

export function SettingsDashboardLink() {
  const isMobile = useIsMobileStore((store) => store.isMobile);

  const $sidebarWrapper = useSettingsPageDomObserverStore(
    (store) => store.$sidebarWrapper,
    isMobile ? undefined : deepEqual,
  );

  const portalContainer = useMemo(() => {
    if ($sidebarWrapper == null || !$sidebarWrapper.length) return null;

    const $existingContainer = $sidebarWrapper.find(
      DomSelectorsService.cplxAttribute(
        DomSelectorsService.internalAttributes.SETTINGS_PAGE
          .CPLX_DASHBOARD_LINK,
      ),
    );

    if ($existingContainer[0]) return $existingContainer[0];

    const $portalContainer = $("<div>")
      .internalComponentAttr(
        DomSelectorsService.internalAttributes.SETTINGS_PAGE
          .CPLX_DASHBOARD_LINK,
      )
      .insertAfter(
        $sidebarWrapper.find(
          DomSelectorsService.cachedSync.SETTINGS_PAGE.SIDEBAR_CHILD
            .BACK_BUTTON,
        ),
      );

    return $portalContainer[0];
  }, [$sidebarWrapper]);

  if (portalContainer == null) return null;

  return (
    <Portal container={portalContainer}>
      <div
        className="x:mx-3 x:flex x:cursor-pointer x:items-center x:justify-start x:gap-1 x:rounded-lg x:px-3 x:py-2 x:text-sm x:font-medium x:text-foreground x:transition-all x:hover:bg-primary-foreground"
        onClick={() => {
          sendMessage("bg:openOptionsPage", undefined, "background");
        }}
      >
        <div className="x:flex x:items-center x:gap-1.5">
          <Cplx className="x:size-4 x:fill-foreground" />
          <div>Complexity</div>
        </div>
        <FaArrowUpRight className="x:ml-auto x:size-3.5 x:text-muted-foreground" />
      </div>
    </Portal>
  );
}
