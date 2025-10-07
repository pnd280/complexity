import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:showMessageLength": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  showTokens: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:showMessageLength",
    title: "Show Message Length",
    description:
      "Show the length of each message in words, characters, and tokens",
    dashboardMeta: {
      tags: ["ui", "cometAssistant"],
      categories: ["thread"],
      uiRouteSegment: "thread-show-message-length",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:thread:messageBlocks"],
      uiGroups: [
        "thread:messageBlocks:footer",
        "thread:messageBlocks:queryEditButton",
      ],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      showTokens: false,
    },
  },
});
