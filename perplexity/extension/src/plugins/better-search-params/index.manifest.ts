import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    betterSearchParams: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "betterSearchParams",
    title: "Better Omnibox Search Params",
    description:
      'Default omnibox searches always use "Sonar/Auto" model.\nUse this plugin to search with different models, focus modes, and incognito mode, etc.',
    dashboardMeta: {
      tags: ["new"],
      categories: ["misc"],
      uiRouteSegment: "better-search-params",
    },
    dependencies: {
      corePlugins: ["spaRouter", "networkIntercept"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
