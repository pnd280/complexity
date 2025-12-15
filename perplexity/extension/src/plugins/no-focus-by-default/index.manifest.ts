import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/no-focus-by-default/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "noFocusByDefault",
  name: "No Focus By Default",
  description: "Automatically disables web search focus on new chats",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: [],
  categories: ["featured", "queryBox"],
  uiRouteSegment: "disable-web-search-by-default",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter", "domObservers:internalSearchStates"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
