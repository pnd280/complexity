import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    imageGenModelSelector: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "imageGenModelSelector",
    title: "Image Generation Model Selector",
    description: "Enable selection of different image generation models",
    dashboardMeta: {
      tags: ["ui", "desktopOnly", "pplxPro"],
      categories: ["thread"],
      uiRouteSegment: "image-gen-model-selector",
    },
    dependencies: {
      corePlugins: ["webSocket", "domObservers:thread"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
