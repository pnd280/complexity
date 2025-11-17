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

export const settingsStorage = new PluginSettingsService<
  (typeof settingsSchemas)[1]["fallback"]
>({
  id: "blockAnalyticEvents",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
