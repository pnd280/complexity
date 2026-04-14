import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { getPlatform } from "@/hooks/usePlatformDetection";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/query-box-submit-on-ctrl-enter/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "queryBox:submitOnCtrlEnter",
  name: `Submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
  description: `Insert new line on Enter, submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
});

const dashboardMeta = definePluginDashboardMeta({
  tags: [],
  categories: ["queryBox"],
  uiRouteSegment: "query-box-submit-on-ctrl-enter",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:queryBoxes", "domObservers:thread:messageBlocks"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
