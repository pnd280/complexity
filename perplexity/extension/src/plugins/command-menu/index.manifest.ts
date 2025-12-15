import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/command-menu/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "commandMenu",
  name: "Command Menu",
  description: "Quickly navigate around and invoke actions",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly"],
  categories: ["misc"],
  uiRouteSegment: "command-menu",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter", "webSocket"],
});

const manifest = {
  meta,
  dependencies,
  dashboardMeta,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
