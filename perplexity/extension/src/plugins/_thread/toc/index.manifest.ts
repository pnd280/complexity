import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/toc/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:toc",
  name: "Table of Contents",
  description: "Quickly navigate between messages in a thread",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui"],
  categories: ["thread"],
  uiRouteSegment: "thread-toc",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:thread", "domObservers:thread:messageBlocks"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
