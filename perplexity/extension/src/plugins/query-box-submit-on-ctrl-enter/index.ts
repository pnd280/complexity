import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:submitOnCtrlEnter": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "queryBox:submitOnCtrlEnter",
    settingsUiRouteSegment: "query-box-submit-on-ctrl-enter",
    title: `Submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
    description: `Insert new line on Enter, submit on ${getPlatform() === "mac" ? "Cmd" : "Ctrl"}+Enter`,
    categories: ["queryBox", "comet"],
    tags: [],
    dependentDomObservers: ["queryBoxes"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
