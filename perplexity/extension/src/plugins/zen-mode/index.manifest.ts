import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { settingsSchemas, settingsStorage } from "@/plugins/zen-mode/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "zenMode",
  name: "Zen Mode",
  description:
    "Hide elements on the page to focus on the content (toggleable). Enable via the Command Menu plugin.",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly"],
  categories: ["misc"],
  uiRouteSegment: "zen-mode",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter", "commandMenu"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
