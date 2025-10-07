import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
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
      categories: ["queryBox"],
      uiRouteSegment: "query-box-language-model-selector",
    },
    dependencies: {
      corePlugins: [
        "networkIntercept",
        "spaRouter",
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
