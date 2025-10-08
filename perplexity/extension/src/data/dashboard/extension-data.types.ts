import { z } from "zod";

import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginsDbDataSchema } from "@/__registries__/plugins/meta.types";
import { ThemeSchema } from "@/data/dashboard/themes/theme.types";
import { ExtensionSettingsSchema } from "@/services/infra/extension-api-wrappers/extension-settings/types";

const coreDbSchema = {
  themes: z.array(ThemeSchema),
};

const pluginDbSchemas = Object.fromEntries(
  Object.entries(PluginManifestsRegistry.indexedDbTableValidationSchemas).map(
    ([tableName, schema]) => [tableName, z.array(schema)],
  ),
) as unknown as PluginsDbDataSchema;

export const ExtensionDataSchema = z.object({
  settings: z.object({
    settings: ExtensionSettingsSchema,
    settings$: z.object({
      v: z.number(),
    }),
  }),
  db: z.object({
    ...coreDbSchema,
    ...pluginDbSchemas,
  }),
});

export type ExtensionData = z.infer<typeof ExtensionDataSchema>;
