import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:rawHeadings": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:rawHeadings",
    title: "Raw Headings",
    description: "Prevent headings from being rendered as follow-up links",
    dashboardMeta: {
      tags: ["ui"],
      categories: ["thread"],
      uiRouteSegment: "thread-raw-headings",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:thread:messageBlocks"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
