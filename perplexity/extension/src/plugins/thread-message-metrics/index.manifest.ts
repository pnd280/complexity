import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:messageMetrics": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  showTokens: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:messageMetrics",
    title: "Message Metrics",
    description:
      "Show metrics for each message in the thread (words, characters, (estimated) tokens)",
    dashboardMeta: {
      tags: ["ui", "cometAssistant"],
      categories: ["thread", "comet"],
      uiRouteSegment: "thread-message-metrics",
    },
    dependencies: {
      corePlugins: ["domObservers:thread:messageBlocks"],
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
