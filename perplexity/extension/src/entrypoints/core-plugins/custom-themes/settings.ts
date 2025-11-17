import z from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z.object({
      enabled: z.literal(true),
      themeId: z.string(),
    }),
    fallback: {
      enabled: true,
      themeId: "complexity",
    },
  },
});

export const settingsStorage = new PluginSettingsService<
  z.infer<(typeof settingsSchemas)[1]["schema"]>
>({
  id: "customTheme",
  settingsSchemas,
});
