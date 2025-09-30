import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
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
      corePlugins: ["spaRouter", "domObservers:home"],
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
