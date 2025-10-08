import type { ZodType } from "zod";

import type {
  PluginId,
  PluginIndexedDbConfig,
  PluginMeta,
  PluginsSettingsSchema,
} from "@/__registries__/plugins/meta.types";

export type PluginManifest<T extends PluginId = PluginId> = {
  meta: PluginMeta<T>;
  settingsSchema: {
    schema: ZodType<PluginsSettingsSchema[T]>;
    fallback: PluginsSettingsSchema[T];
  };
  indexedDb?: PluginIndexedDbConfig;
};
