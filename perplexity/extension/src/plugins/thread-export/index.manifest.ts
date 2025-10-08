import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:exportThread": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:exportThread",
    title: "Export Thread",
    description:
      "Export the current thread in markdown format (with optional citations). More formatting options coming soon.",
    dashboardMeta: {
      tags: ["ui"],
      categories: ["thread"],
      uiRouteSegment: "thread-export-thread",
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
