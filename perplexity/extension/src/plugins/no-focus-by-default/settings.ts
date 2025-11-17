import { z } from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.boolean(),
    }),
    fallback: {
      enabled: false,
    },
  },
});

export type Settings = z.infer<(typeof settingsSchemas)[1]["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "noFocusByDefault",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
