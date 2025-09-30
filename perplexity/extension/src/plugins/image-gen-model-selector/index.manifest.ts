import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
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
      corePlugins: ["spaRouter", "webSocket", "domObservers:thread"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
