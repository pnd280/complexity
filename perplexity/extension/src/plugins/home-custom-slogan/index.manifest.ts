import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "home:customSlogan": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  slogan: z.string(),
});

export default definePlugin({
  meta: {
    id: "home:customSlogan",
    title: "Custom Home Slogan",
    description: "Customize the slogan on the homepage",
    dashboardMeta: {
      tags: ["ui"],
      categories: ["misc"],
      uiRouteSegment: "home-custom-slogan",
    },
    dependencies: {
      corePlugins: ["domObservers:home"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      slogan: "",
    },
  },
});
