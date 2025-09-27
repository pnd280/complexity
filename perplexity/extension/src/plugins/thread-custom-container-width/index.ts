import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:customThreadContainerWidth": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  value: z.number(),
});

export default definePlugin({
  manifest: {
    id: "thread:customThreadContainerWidth",
    settingsUiRouteSegment: "thread-custom-thread-container-width",
    title: "Custom Thread Container Width",
    description: "Customize the maximum width of the thread container",
    categories: ["thread"],
    tags: ["ui", "desktopOnly"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      value: 740,
    },
  },
});
