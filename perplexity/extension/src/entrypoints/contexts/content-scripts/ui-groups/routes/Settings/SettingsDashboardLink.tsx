import Cplx from "@/components/icons/Cplx";
import { Portal } from "@/components/ui/portal";
import { useSettingsPageDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/settings-page/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { BgUtilsService } from "@/entrypoints/services/features/bg-utils/service-init.bg-worker";
import { useIsMobileStore } from "@/hooks/is-mobile-store";

import TablerArrowUpRight from "~icons/tabler/arrow-up-right";

export function SettingsDashboardLink() {
  const isMobile = useIsMobileStore((store) => store.isMobile);

  const sidebarWrapper = useSettingsPageDomObserverStore(
    (store) => store.sidebarWrapper,
    isMobile ? undefined : deepEqual,
  );

  if (!sidebarWrapper) return null;

  const $sidebarWrapper = $(sidebarWrapper);

  if (!$sidebarWrapper.length) return null;

  const $existingContainer = $sidebarWrapper.find(
    DomSelectorsService.Root.cplxAttribute(
      DomSelectorsService.Root.internalAttributes.SETTINGS_PAGE
        .CPLX_DASHBOARD_LINK,
    ),
  );

  const portalContainer =
    $existingContainer[0] ??
    $("<div>")
      .internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.SETTINGS_PAGE
          .CPLX_DASHBOARD_LINK,
      )
      .insertAfter(
        $sidebarWrapper.find(
          DomSelectorsService.Root.cachedSync.SETTINGS_PAGE.SIDEBAR_CHILD
            .BACK_BUTTON,
        ),
      )[0];

  if (portalContainer == null) return null;

  return (
    <Portal container={portalContainer}>
      <div
        className="x:mx-3 x:flex x:cursor-pointer x:items-center x:justify-start x:gap-1 x:rounded-lg x:px-3 x:py-2 x:text-sm x:font-medium x:text-foreground x:transition-all x:hover:bg-foreground-subtle"
        onClick={() => {
          void BgUtilsService.Instance.openOptionsPage();
        }}
      >
        <div className="x:flex x:items-center x:gap-1.5">
          <Cplx className="x:size-4 x:fill-foreground" />
          <div>Complexity</div>
        </div>
        <TablerArrowUpRight className="x:ml-auto x:size-4 x:text-muted-foreground" />
      </div>
    </Portal>
  );
}
