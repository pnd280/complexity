import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:spacesThreadsForceWritingMode": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "queryBox:spacesThreadsForceWritingMode",
    settingsUiRouteSegment: "query-box-spaces-threads-force-writing-mode",
    title: "Spaces: Force Writing Mode",
    tags: ["deprecated", "experimental"],
    description:
      "Force AI responses in Space's threads to use the old writing mode (toggleable)",
    categories: ["misc"],
    uiGroup: ["queryBoxes:toolbar:space"],
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
