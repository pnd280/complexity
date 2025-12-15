import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/better-search-params/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "betterSearchParams",
  name: "Better Search Params",
  description:
    "Create and use custom omnibox search params with different models, focus modes, Spaces and incognito mode, etc.",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: [],
  categories: ["misc", "featured"],
  uiRouteSegment: "better-search-params",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter", "networkIntercept"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
