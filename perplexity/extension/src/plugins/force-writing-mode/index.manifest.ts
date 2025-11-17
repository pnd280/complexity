import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/force-writing-mode/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "queryBox:spacesThreadsForceWritingMode",
  name: "Spaces: Force Writing Mode",
  description:
    "Force AI responses in Space's threads to use the old writing mode (toggleable)",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["deprecated", "experimental"],
  categories: ["misc"],
  uiRouteSegment: "query-box-spaces-threads-force-writing-mode",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:queryBoxes"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
