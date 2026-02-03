import z from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.boolean(),
      showModelSelectionMismatchWarning: z.boolean(),
      spoofTimezone: z.boolean(),
    }),
    fallback: {
      enabled: false,
      showModelSelectionMismatchWarning: true,
      spoofTimezone: false,
    },
  },
  2: {
    schema: z.object({
      enabled: z.boolean(),
      spoofTimezone: z.boolean(),
    }),
    fallback: {
      enabled: false,
      spoofTimezone: false,
    },
  },
});

export type Settings = z.infer<(typeof settingsSchemas)[2]["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "queryBox:languageModelSelector",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
