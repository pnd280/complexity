import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    incognitoByDefault: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "incognitoByDefault",
    settingsUiRouteSegment: "incognito-by-default",
    title: "Incognito By Default",
    description: "Automatically turns on incognito mode on new tabs",
    categories: ["misc"],
    tags: ["new"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
