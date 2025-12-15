import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import {
  settingsSchemas,
  settingsStorage,
} from "@/plugins/image-gen-model-selector/settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "imageGenModelSelector",
  name: "Image Generation Model Selector",
  description:
    "Select different image generation models via the Command Menu plugin",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly", "pplxPro"],
  categories: ["misc"],
  uiRouteSegment: "image-gen-model-selector",
});

const dependencies = definePluginDependencies({
  plugins: ["commandMenu"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
