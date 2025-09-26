import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:messageTts": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  playbackRate: z.number().min(0.75).max(2),
});

export default definePlugin({
  manifest: {
    id: "thread:messageTts",
    settingsUiRouteSegment: "thread-message-tts",
    title: "Text-to-Speech",
    description: "Enable text-to-speech for messages in threads",
    categories: ["thread", "comet"],
    tags: ["ui", "cometAssistant"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
    uiGroup: ["thread:messageBlocks:footer"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      playbackRate: 1,
    },
  },
});
