import { z } from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";
import { getPlatform } from "@/hooks/usePlatformDetection";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.boolean(),
      persistent: z.boolean(),
      alwaysHideRelatedQuestions: z.boolean(),
      hotkey: z.array(z.string()),
    }),
    fallback: {
      enabled: false,
      persistent: false,
      alwaysHideRelatedQuestions: false,
      hotkey: [getPlatform() === "mac" ? Key.Meta : Key.Control, Key.Alt, "z"],
    },
  },
});

export type Settings = z.infer<(typeof settingsSchemas)[1]["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "zenMode",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
