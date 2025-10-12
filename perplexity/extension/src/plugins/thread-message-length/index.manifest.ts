import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
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
      categories: ["thread", "comet"],
      uiRouteSegment: "thread-show-message-length",
    },
    dependencies: {
      corePlugins: ["domObservers:thread:messageBlocks"],
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
