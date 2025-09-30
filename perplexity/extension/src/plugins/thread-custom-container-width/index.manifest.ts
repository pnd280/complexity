import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:customThreadContainerWidth": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  value: z.number(),
});

export default definePlugin({
  meta: {
    id: "thread:customThreadContainerWidth",
    title: "Custom Thread Container Width",
    description: "Customize the maximum width of the thread container",
    dashboardMeta: {
      tags: ["ui", "desktopOnly"],
      categories: ["thread"],
      uiRouteSegment: "thread-custom-thread-container-width",
    },
    dependencies: {
      corePlugins: ["spaRouter"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      value: 740,
    },
  },
});
