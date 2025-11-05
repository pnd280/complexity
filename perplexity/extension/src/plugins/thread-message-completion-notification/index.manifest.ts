import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:messageCompletionNotification": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:messageCompletionNotification",
    title: "Message Completion Notification",
    description:
      "Show system notifications when normal searches/answers (not including Research/Labs) are completed.\nRequires browser notifications to be enabled.",
    dashboardMeta: {
      tags: ["new"],
      categories: ["thread", "featured"],
      uiRouteSegment: "thread-message-completion-notification",
    },
    dependencies: {
      corePlugins: ["networkIntercept"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
