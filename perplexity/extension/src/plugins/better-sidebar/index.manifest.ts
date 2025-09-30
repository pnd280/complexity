import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    betterSidebar: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  shouldPreventLayoutShift: z.boolean(),
});

export default definePlugin({
  meta: {
    devOnly: true,

    id: "betterSidebar",
    title: "Better Sidebar",
    description: "Vanilla sidebar sucks hard, replaces it with a better one!",
    dashboardMeta: {
      categories: ["misc"],
      tags: ["ui", "desktopOnly"],
      uiRouteSegment: "better-sidebar",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:sidebar"],
    },
    extensionPermissions: {
      optionalPermissions: [
        {
          permission: "webNavigation",
          rationale:
            "Uses a different strategy to apply styles to the page to prevent layout shift when the page loads. It does NOT use this permission to view your browsing history.",
        },
      ],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      shouldPreventLayoutShift: true,
    },
  },
});
