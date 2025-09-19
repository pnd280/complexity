import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:languageModelSelector": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  respectDefaultSpaceModel: z.boolean(),
  changeTimezone: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "queryBox:languageModelSelector",
    settingsUiRouteSegment: "query-box-language-model-selector",
    title: "Better Language Model Selector",
    description: "Take complete control of all available language models",
    categories: ["queryBox", "comet"],
    tags: ["ui", "pplxPro", "cometAssistant"],
    uiGroup: [
      "queryBoxes:toolbar:main",
      "queryBoxes:toolbar:space",
      "queryBoxes:toolbar:followUp",
      "queryBoxes:toolbar:cometAssistant",
    ],
    dependentDomObservers: ["queryBoxes", "internalSearchStates"],
    dependentMainWorldCorePlugins: [
      "networkIntercept",
      "spaRouter",
      "reactVdom",
    ],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      respectDefaultSpaceModel: false,
      changeTimezone: false,
    },
  },
});
