import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
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
      "Create and use custom omnibox search params with different models, focus modes, and incognito mode, etc.\n\nNow supports Spaces!",
    dashboardMeta: {
      tags: ["updated"],
      categories: ["misc", "featured"],
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
