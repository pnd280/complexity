import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "queryBox:submitOnCtrlEnter": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "queryBox:submitOnCtrlEnter",
    title: `Submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
    description: `Insert new line on Enter, submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
    dashboardMeta: {
      tags: [],
      categories: ["queryBox"],
      uiRouteSegment: "query-box-submit-on-ctrl-enter",
    },
    dependencies: {
      corePlugins: ["domObservers:queryBoxes"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
