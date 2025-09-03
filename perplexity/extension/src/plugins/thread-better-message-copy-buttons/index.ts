import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterMessageCopyButtons": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "thread:betterMessageCopyButtons",
    settingsUiRouteSegment: "thread-better-message-copy-buttons",
    title: "Better Message Copy Buttons",
    description:
      "Copy message content without citations. More formatting options coming soon",
    categories: ["thread", "comet"],
    tags: ["ui", "cometAssistant"],
    uiGroup: ["thread:messageBlocks:footer"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
