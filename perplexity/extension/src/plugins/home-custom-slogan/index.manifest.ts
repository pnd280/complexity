import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/home-custom-slogan/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "home:customSlogan",
  name: "Custom Home Slogan",
  description: "Customize the slogan on the homepage",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui"],
  categories: ["misc"],
  uiRouteSegment: "home-custom-slogan",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:home"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
