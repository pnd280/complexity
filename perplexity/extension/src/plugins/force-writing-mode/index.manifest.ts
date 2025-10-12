import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "queryBox:spacesThreadsForceWritingMode": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "queryBox:spacesThreadsForceWritingMode",
    title: "Spaces: Force Writing Mode",
    description:
      "Force AI responses in Space's threads to use the old writing mode (toggleable)",
    dashboardMeta: {
      tags: ["deprecated", "experimental"],
      categories: ["misc"],
      uiRouteSegment: "query-box-spaces-threads-force-writing-mode",
    },

    dependencies: {
      corePlugins: ["domObservers:queryBoxes"],
      uiGroups: ["queryBoxes:toolbar:space:rl"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
