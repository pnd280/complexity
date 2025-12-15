import {
  definePluginDashboardMeta,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/comet-isolated-zoom/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "comet:isolatedZoom",
  name: "Comet: Isolated Zoom",
  description:
    "Enable interface zoom on Comet Assistant without affecting the main page",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "cometAssistant", "cometAssistantOnly"],
  categories: ["comet"],
  uiRouteSegment: "comet-isolated-zoom",
});

const manifest = {
  meta,
  dashboardMeta,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
