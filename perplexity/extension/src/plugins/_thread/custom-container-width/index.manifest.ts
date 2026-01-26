import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/custom-container-width/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:customThreadContainerWidth",
  name: "Custom Thread Container Width",
  description: "Customize the maximum width of the thread container",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly"],
  categories: ["thread"],
  uiRouteSegment: "thread-custom-thread-container-width",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
