import type { ZodType } from "zod";

import type {
  PluginIndexedDbConfig,
  PluginManifest,
  PluginsSettingsSchema,
  TypedPluginManifest,
} from "@/data/plugin-registry/types";

export type DefinePluginParams<T extends PluginManifest["id"]> = {
  manifest: TypedPluginManifest<T>;
  settingsSchema: {
    schema: ZodType;
    fallback: PluginsSettingsSchema[T];
  };
  indexedDb?: PluginIndexedDbConfig;
};

export const definePlugin = <T extends PluginManifest["id"]>(
  params: DefinePluginParams<T>,
) => {
  return params;
};
