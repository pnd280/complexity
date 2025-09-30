import { z } from "zod";

import { definePlugin } from "@/data/registries/plugins/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

declare module "@/data/registries/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    commandMenu: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  keybindings: z.object({
    toggle: z.array(z.string()),
    threadsSearch: z.array(z.string()),
    spacesSearch: z.array(z.string()),
    toggleSidecar: z.array(z.string()),
  }),
});

export default definePlugin({
  meta: {
    id: "commandMenu",
    title: "Command Menu",
    description: "Quickly navigate around and invoke actions",
    dashboardMeta: {
      tags: ["ui", "desktopOnly"],
      categories: ["misc"],
      uiRouteSegment: "command-menu",
    },
    dependencies: {
      corePlugins: ["spaRouter", "webSocket"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      keybindings: {
        toggle: [
          getPlatform() === "mac" ? Key.Meta : Key.Control,
          getPlatform() === "mac" ? "i" : "k",
        ],
        threadsSearch: [Key.Alt, "t"],
        spacesSearch: [Key.Alt, "y"],
        toggleSidecar: [getPlatform() === "mac" ? Key.Meta : Key.Control, "e"],
      },
      enabled: false,
    },
  },
});
