import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/_thread/raw-headings/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:rawHeadings",
  name: "Raw Headings",
  description: "Prevent headings from being rendered as follow-up links",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui"],
  categories: ["thread"],
  uiRouteSegment: "thread-raw-headings",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
