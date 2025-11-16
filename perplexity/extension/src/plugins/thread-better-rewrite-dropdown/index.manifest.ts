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
    description:
      "A better dropdown for rewriting messages.\nOptionally forces the agent to redo the search process.",
    dashboardMeta: {
      tags: ["ui", "pplxPro", "updated"],
      categories: ["thread", "featured"],
      uiRouteSegment: "thread-better-rewrite-dropdowns",
    },
    dependencies: {
      corePlugins: ["domObservers:thread:messageBlocks"],
      plugins: ["queryBox:languageModelSelector"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
