import type { ZodType } from "zod";

import type {
  PluginId,
  PluginIndexedDbConfig,
  PluginMeta,
  PluginsSettingsSchema,
} from "@/data/registries/plugins/meta.types";

export type PluginManifest<T extends PluginId> = {
  meta: PluginMeta<T>;
  settingsSchema: {
    schema: ZodType;
    fallback: PluginsSettingsSchema[T];
  };
  indexedDb?: PluginIndexedDbConfig;
};
