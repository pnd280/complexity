import { z } from "zod";

import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";

export const ExtensionDataSchema = z.object({
  pluginsSettings: z.record(
    z.string<keyof PluginsSettings>(),
    z
      .object({
        settings: z.unknown(),
        meta: z.unknown(),
      })
      .loose(),
  ),
  misc: z.record(
    z.string(),
    z
      .object({
        settings: z.unknown(),
        meta: z.unknown(),
      })
      .loose(),
  ),
  indexedDb: z.string(),
});

export type ExtensionData = z.infer<typeof ExtensionDataSchema>;
