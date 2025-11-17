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
  description: "Enable selection of different image generation models",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui", "desktopOnly", "pplxPro"],
  categories: ["thread"],
  uiRouteSegment: "image-gen-model-selector",
});

const dependencies = definePluginDependencies({
  plugins: ["webSocket", "domObservers:thread"],
});

const manifest = {
  meta,
  dashboardMeta,
  dependencies,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
