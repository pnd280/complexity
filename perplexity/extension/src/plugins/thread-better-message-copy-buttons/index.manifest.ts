import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:betterMessageCopyButtons": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:betterMessageCopyButtons",
    title: "Better Message Copy Buttons",
    description:
      "Copy message content without citations. More formatting options coming soon",
    dashboardMeta: {
      tags: ["ui", "cometAssistant"],
      categories: ["thread", "comet"],
      uiRouteSegment: "thread-better-message-copy-buttons",
    },
    dependencies: {
      corePlugins: ["domObservers:thread:messageBlocks"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
