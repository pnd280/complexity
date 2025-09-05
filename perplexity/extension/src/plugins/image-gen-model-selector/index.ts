import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    imageGenModelSelector: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "imageGenModelSelector",
    settingsUiRouteSegment: "image-gen-model-selector",
    title: "Image Generation Model Selector",
    description: "Enable selection of different image generation models",
    categories: ["thread"],
    tags: ["deprecated", "ui", "desktopOnly", "pplxPro"],
    dependentDomObservers: ["thread"],
    dependentMainWorldCorePlugins: ["spaRouter", "webSocket"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
