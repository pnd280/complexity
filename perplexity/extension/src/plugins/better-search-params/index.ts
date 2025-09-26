import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    betterSearchParams: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "betterSearchParams",
    settingsUiRouteSegment: "better-search-params",
    title: "Better Omnibox Search Params",
    description:
      'Default omnibox searches always use "Sonar/Auto" model.\nUse this plugin to search with different models, focus modes, and incognito mode, etc.',
    categories: ["misc"],
    tags: ["new"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
