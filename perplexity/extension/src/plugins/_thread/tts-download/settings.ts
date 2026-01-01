import { z } from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";

import { TtsVoiceSchema } from "./types";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.boolean(),
      defaultVoice: TtsVoiceSchema,
    }),
    fallback: {
      enabled: false,
      defaultVoice: "Mike" as const,
    },
  },
});

type LatestSettingsSchema =
  (typeof settingsSchemas)[keyof typeof settingsSchemas];

export type Settings = z.infer<LatestSettingsSchema["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "thread:ttsDownload",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
