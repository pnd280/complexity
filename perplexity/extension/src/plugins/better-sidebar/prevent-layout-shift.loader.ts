import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import {
  betterSidebarNormalizeCollapsedCssResourceConfig,
  betterSidebarNormalizeExpandedCssResourceConfig,
} from "@/plugins/better-sidebar/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { InstantCssService } from "@/services/features/instant-css";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { sendMessage } from "@/types/chrome-runtime-message";
import { getCookie } from "@/utils/dom-utils/generics";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:betterSidebar:instantCss": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:betterSidebar:instantCss",
    dependencies: ["cache:pluginsEnableStates", "store:pluginGuards"],
    loader: async ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "store:pluginGuards": pluginGuardsStore,
    }) => {
      await applyLayoutShiftPreventionInstantCss({
        enabled:
          pluginsEnableStates["betterSidebar"] &&
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
      persistentQueryClient,
    ),
    getVersionedRemoteResource(
      betterSidebarNormalizeExpandedCssResourceConfig,
      persistentQueryClient,
    ),
  ]);

  const tabId = await sendMessage("getTabId");

  if (!tabId) return;

  const state = getCookie("isSidebarPinned");

  const action = enabled
    ? InstantCssService.registerInstantCss
    : InstantCssService.removeInstantCss;

  await action({
    id: "plugin:betterSidebar:normalizeLayout",
    css: state === "true" ? normalizeExpandedCss : normalizeCollapsedCss,
    tabId,
  });
}
