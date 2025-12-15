import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/export/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:exportThread",
  name: "Export Thread",
  description:
    "Export the current thread in markdown format (with optional citations). More formatting options coming soon.",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui"],
  categories: ["thread"],
  uiRouteSegment: "thread-export-thread",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:thread:messageBlocks"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
