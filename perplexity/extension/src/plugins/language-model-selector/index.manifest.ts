import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "queryBox:languageModelSelector": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  changeTimezone: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "queryBox:languageModelSelector",
    title: "Better Language Model Selector",
    description: "Take complete control of all available language models",
    dashboardMeta: {
      tags: ["ui", "pplxPro", "cometAssistant"],
      categories: ["queryBox", "comet"],
      uiRouteSegment: "query-box-language-model-selector",
    },
    dependencies: {
      corePlugins: [
        "networkIntercept",
        "domObservers:queryBoxes",
        "domObservers:internalSearchStates",
      ],
      uiGroups: [
        "queryBoxes:toolbar:main:ll",
        "queryBoxes:toolbar:space:ll",
        "queryBoxes:toolbar:followUp:ll",
        "queryBoxes:toolbar:cometAssistant:rl",
      ],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      changeTimezone: false,
    },
  },
});
