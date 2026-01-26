import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/artifacts/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:artifacts",
  name: "Artifacts",
  description:
    "Visualize and interact with generated content side by side - similar to claude.ai's artifacts",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["desktopOnly", "ui"],
  categories: ["thread"],
  uiRouteSegment: "thread-artifacts",
});

const dependencies = definePluginDependencies({
  plugins: [
    "domObservers:thread:codeBlocks",
    "domObservers:thread:messageBlocks",
    "thread:betterCodeBlocks",
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
