import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/language-model-selector/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "queryBox:languageModelSelector",
  name: "Language Model Selector",
  description: "Select the language model for the chat",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "pplxPro", "cometAssistant"],
  categories: ["queryBox", "comet"],
  uiRouteSegment: "query-box-language-model-selector",
});

const dependencies = definePluginDependencies({
  plugins: [
    "networkIntercept",
    "domObservers:queryBoxes",
    "domObservers:internalSearchStates",
    "domObservers:thread:messageBlocks",
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
