import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    "thread:artifacts": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  meta: {
    id: "thread:artifacts",
    title: "Artifacts",
    description:
      "Visualize and interact with generated content side by side - similar to claude.ai's artifacts",
    dashboardMeta: {
      tags: ["desktopOnly", "ui"],
      categories: ["thread"],
      uiRouteSegment: "thread-artifacts",
    },
    dependencies: {
      corePlugins: [
        "spaRouter",
        "domObservers:thread:codeBlocks",
        "domObservers:thread:messageBlocks",
      ],
      plugins: ["thread:betterCodeBlocks"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
