import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    betterSidebar: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  shouldPreventLayoutShift: z.boolean(),
});

export default definePlugin({
  manifest: {
    devOnly: true,
    id: "betterSidebar",
    settingsUiRouteSegment: "better-sidebar",
    title: "Better Sidebar",
    description: "Vanilla sidebar sucks hard, replaces it with a better one!",
    categories: ["misc"],
    tags: ["ui", "desktopOnly"],
    dependentDomObservers: ["sidebar"],
    dependentMainWorldCorePlugins: ["spaRouter"],
    optionalPermissions: [
      {
        permission: "webNavigation",
        rationale:
          "Uses a different strategy to apply styles to the page to prevent layout shift when the page loads. It does NOT use this permission to view your browsing history.",
      },
    ],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      shouldPreventLayoutShift: true,
    },
  },
});
