import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { permissions } from "@/plugins/better-sidebar/permissions";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/better-sidebar/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "betterSidebar",
  name: "Better Sidebar",
  description: "Vanilla sidebar sucks hard, replaces it with a better one!",
  devOnly: true,
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly"],
  categories: ["misc"],
  uiRouteSegment: "better-sidebar",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:sidebar"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
  permissions,
} satisfies PluginManifestExports;

export default manifest;
