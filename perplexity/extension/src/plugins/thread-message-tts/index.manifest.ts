import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:messageTts": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  playbackRate: z.number().min(0.75).max(2),
});

export default definePlugin({
  meta: {
    id: "thread:messageTts",
    title: "Text-to-Speech",
    description: "Enable text-to-speech for messages in threads",
    dashboardMeta: {
      tags: ["ui", "cometAssistant"],
      categories: ["thread"],
      uiRouteSegment: "thread-message-tts",
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
      playbackRate: 1,
    },
  },
});
