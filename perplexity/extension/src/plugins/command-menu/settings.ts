import z from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";
import { getPlatform } from "@/hooks/usePlatformDetection";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.boolean(),
      keybindings: z.object({
        toggle: z.array(z.string()),
        threadsSearch: z.array(z.string()),
        spacesSearch: z.array(z.string()),
        toggleSidecar: z.array(z.string()),
      }),
    }),
    fallback: {
      enabled: false,
      keybindings: {
        toggle: [
          getPlatform() === "mac" ? Key.Meta : Key.Control,
          getPlatform() === "mac" ? "i" : "k",
        ],
        threadsSearch: [Key.Alt, "t"],
        spacesSearch: [Key.Alt, "y"],
        toggleSidecar: [getPlatform() === "mac" ? Key.Meta : Key.Control, "e"],
      },
    },
  },
});

export type Settings = z.infer<(typeof settingsSchemas)[1]["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "commandMenu",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
