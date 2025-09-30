import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    zenMode: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  persistent: z.boolean(),
  lastState: z.boolean(),
  alwaysHideRelatedQuestions: z.boolean(),
  hotkey: z.array(z.string()),
});

export default definePlugin({
  meta: {
    id: "zenMode",
    title: "Zen Mode",
    description:
      "Hide elements on the page to focus on the content (toggleable). Enable via the Command Menu plugin.",
    dashboardMeta: {
      tags: ["ui", "desktopOnly"],
      categories: ["misc"],
      uiRouteSegment: "zen-mode",
    },
    dependencies: {
      corePlugins: ["spaRouter"],
      plugins: ["commandMenu"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      persistent: false,
      lastState: false,
      alwaysHideRelatedQuestions: false,
      hotkey: [getPlatform() === "mac" ? Key.Meta : Key.Control, Key.Alt, "z"],
    },
  },
});
