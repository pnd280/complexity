import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { InstantCssService } from "@/entrypoints/services/features/instant-css";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import {
  betterSidebarNormalizeCollapsedCssResourceConfig,
  betterSidebarNormalizeExpandedCssResourceConfig,
} from "@/plugins/better-sidebar/index.remote-resources";
import { sendMessage } from "@/types/chrome-runtime-message";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
          PluginsSettingSnapshotsService.getPluginSnapshot("betterSidebar")
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

  const state = localStorage.getItem(
    "pplx.local-user-settings.isSidebarPinned",
  );

  const action = enabled
    ? InstantCssService.registerInstantCss
    : InstantCssService.removeInstantCss;

  await action({
    id: "plugin:betterSidebar:normalizeLayout",
    css: state === "true" ? normalizeExpandedCss : normalizeCollapsedCss,
    tabId,
  });
}
