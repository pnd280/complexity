import z from "zod";

import { definePluginSettingsSchemas } from "@/entrypoints/services/plugins/defines";
import { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";
import { BetterCodeBlockGlobalOptionsSchema } from "@/plugins/_thread/better-code-blocks/types";

export const settingsSchemas = definePluginSettingsSchemas({
  1: {
    schema: z
      .object({
        enabled: z.boolean(),
      })
      .extend(BetterCodeBlockGlobalOptionsSchema.shape),
    fallback: {
      enabled: false,
      stickyHeader: true,
      showLineNumbers: false,
      unwrap: {
        enabled: true,
        showToggleButton: true,
      },
      maxHeight: {
        enabled: true,
        collapseByDefault: false,
        value: 500,
        showToggleButton: true,
      },
      maxWidth: {
        enabled: false,
        value: 100,
      },
    },
  },
});

export type Settings = z.infer<(typeof settingsSchemas)[1]["schema"]>;

export const settingsStorage = new PluginSettingsService<Settings>({
  id: "thread:betterCodeBlocks",
  settingsSchemas,
});

export function useSettings() {
  return usePluginSettings(settingsStorage);
}
