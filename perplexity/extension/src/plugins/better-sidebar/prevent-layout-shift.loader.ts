import { sendMessage } from "webext-bridge/content-script";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  betterSidebarNormalizeCollapsedCssResourceConfig,
  betterSidebarNormalizeExpandedCssResourceConfig,
} from "@/plugins/better-sidebar/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { InstantCssService } from "@/services/features/instant-css";
import { ExtensionSettingsService } from "@/services/infra/extension-settings";
import { getCookie } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:instantCss": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:betterSidebar:instantCss",
    dependencies: ["cache:pluginsStates", "store:pluginGuards"],
    loader: async ({
      "cache:pluginsStates": pluginsStates,
      "store:pluginGuards": pluginGuardsStore,
    }) => {
      await applyLayoutShiftPreventionInstantCss({
        enabled:
          pluginsStates["betterSidebar"] &&
          InstantCssService.hasPermissionsSync({
            grantedPermissions: pluginGuardsStore.grantedPermissions,
          }) &&
          ExtensionSettingsService.cachedSync.plugins.betterSidebar
            .shouldPreventLayoutShift,
      });
    },
  });
}

export async function applyLayoutShiftPreventionInstantCss({
  enabled,
}: {
  enabled: boolean;
}) {
  const [normalizeCollapsedCss, normalizeExpandedCss] = await Promise.all([
    getVersionedRemoteResource(
      betterSidebarNormalizeCollapsedCssResourceConfig,
    ),
    getVersionedRemoteResource(betterSidebarNormalizeExpandedCssResourceConfig),
  ]);

  const tabId = await sendMessage("bg:getTabId", undefined, "background");

  if (!tabId) return;

  const state = getCookie("isSidebarPinned");

  const action = enabled
    ? InstantCssService.registerInstantCss
    : InstantCssService.removeInstantCss;

  action({
    id: "plugin:betterSidebar:normalizeLayout",
    css: state === "true" ? normalizeExpandedCss : normalizeCollapsedCss,
    tabId,
  });
}
