import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { indexedDbSchemas } from "@/plugins/prompt-history/indexed-db";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/prompt-history/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "promptHistory",
  name: "Prompt History",
  description: "Reuse previous prompts",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["slashCommand"],
  categories: ["queryBox"],
  uiRouteSegment: "prompt-history",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter", "networkIntercept", "slashCommand"],
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
