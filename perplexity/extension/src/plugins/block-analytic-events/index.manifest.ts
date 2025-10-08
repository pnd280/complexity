import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    blockAnalyticEvents: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "blockAnalyticEvents",
    title: "Block Analytic Events",
    description: "Prevent Perplexity from sending analytic/tracking events",
    dashboardMeta: {
      tags: ["privacy"],
      categories: ["misc"],
      uiRouteSegment: "block-analytic-events",
    },
    dependencies: {
      corePlugins: ["networkIntercept"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
