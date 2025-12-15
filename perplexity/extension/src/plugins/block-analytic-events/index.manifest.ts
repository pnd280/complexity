import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/block-analytic-events/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "blockAnalyticEvents",
  name: "Block Analytic Events",
  description: "Prevent Perplexity from sending analytic/tracking events",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["privacy"],
  categories: ["misc"],
  uiRouteSegment: "block-analytic-events",
});

const dependencies = definePluginDependencies({
  plugins: ["networkIntercept"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
