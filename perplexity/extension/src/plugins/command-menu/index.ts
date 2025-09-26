import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

declare module "@/data/plugin-registry/types" {
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
  manifest: {
    id: "commandMenu",
    settingsUiRouteSegment: "command-menu",
    title: "Command Menu",
    description: "Quickly navigate around and invoke actions",
    categories: ["misc"],
    tags: ["ui", "desktopOnly"],
    dependentMainWorldCorePlugins: ["spaRouter", "webSocket"],
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
