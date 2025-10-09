import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:betterRewriteDropdowns": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:betterRewriteDropdowns",
    title: "Better Rewrite Dropdowns",
    description: "A better dropdown for rewriting messages",
    dashboardMeta: {
      tags: ["ui", "pplxPro"],
      categories: ["thread"],
      uiRouteSegment: "thread-better-rewrite-dropdowns",
    },
    dependencies: {
      corePlugins: ["domObservers:thread:messageBlocks"],
      plugins: ["queryBox:languageModelSelector"],
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
