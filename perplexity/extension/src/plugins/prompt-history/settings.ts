import z from "zod";

import { SlashCommandMenuTabShortcutSchema } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/shortcuts.types.public";
import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.boolean(),
      shortcut: SlashCommandMenuTabShortcutSchema,
      trigger: z.object({
        onSubmit: z.boolean(),
        onNavigation: z.boolean(),
      }),
    }),
    fallback: {
      enabled: false,
      shortcut: {
        type: "command",
        value: "h",
      },
      trigger: {
        onSubmit: true,
        onNavigation: true,
      },
    },
  },
});

export type Settings = z.infer<(typeof settingsSchemas)[1]["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "promptHistory",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
