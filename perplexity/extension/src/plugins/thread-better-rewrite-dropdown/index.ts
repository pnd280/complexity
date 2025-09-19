import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterRewriteDropdowns": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "thread:betterRewriteDropdowns",
    settingsUiRouteSegment: "thread-better-rewrite-dropdowns",
    title: "Better Rewrite Dropdowns",
    description: "A better dropdown for rewriting messages",
    categories: ["thread"],
    tags: ["ui", "pplxPro"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
    dependentPlugins: ["queryBox:languageModelSelector"],
    uiGroup: ["thread:messageBlocks:footer"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
