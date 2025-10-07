import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    noFocusByDefault: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "noFocusByDefault",
    title: "Disable Web Search (Writing Focus) By Default",
    description:
      "Automatically disables web search focus on new chats (does not affect Spaces)",
    dashboardMeta: {
      tags: ["new"],
      categories: ["featured", "queryBox", "misc"],
      uiRouteSegment: "disable-web-search-by-default",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:internalSearchStates"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
