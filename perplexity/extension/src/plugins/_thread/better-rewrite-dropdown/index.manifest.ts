import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/better-rewrite-dropdown/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:betterRewriteDropdowns",
  name: "Better Rewrite Dropdowns",
  description:
    "A better dropdown for rewriting messages.\nOptionally forces the agent to redo the search process.",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "pplxPro"],
  categories: ["thread"],
  uiRouteSegment: "thread-better-rewrite-dropdowns",
});

const dependencies = definePluginDependencies({
  plugins: [
    "domObservers:thread:messageBlocks",
    "queryBox:languageModelSelector",
  ],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
