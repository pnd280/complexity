import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    incognitoByDefault: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "incognitoByDefault",
    title: "Incognito By Default",
    description: "Automatically turns on incognito mode on new tabs",
    dashboardMeta: {
      tags: ["new"],
      categories: ["misc"],
      uiRouteSegment: "incognito-by-default",
    },
    dependencies: {
      corePlugins: ["spaRouter"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
