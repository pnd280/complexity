import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { indexedDbSchemas } from "@/plugins/_thread/better-code-blocks/indexed-db";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/better-code-blocks/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:betterCodeBlocks",
  name: "Better Code Blocks",
  description: "Enhance code blocks (in threads)",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "highPerfImpact", "cometAssistant"],
  categories: ["thread", "comet"],
  uiRouteSegment: "thread-better-code-blocks",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:thread:codeBlocks"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
  indexedDbSchemas,
} satisfies PluginManifestExports;

export default manifest;
