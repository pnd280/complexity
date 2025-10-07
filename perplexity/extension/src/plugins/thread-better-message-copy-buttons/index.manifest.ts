import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
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
      categories: ["thread"],
      uiRouteSegment: "thread-better-message-copy-buttons",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:thread:messageBlocks"],
      uiGroups: ["thread:messageBlocks:footer"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
