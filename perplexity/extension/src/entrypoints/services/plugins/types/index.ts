import type { IPluginSettingsService } from "@/entrypoints/services/plugins/settings/types";
import type { PluginIndexedDbSchemas } from "@/entrypoints/services/plugins/types/indexed-db";
import type {
  PluginDependencies,
  PluginMeta,
  PluginPermissions,
  PluginDashboardMeta,
} from "@/entrypoints/services/plugins/types/meta";
import type { PluginSettingsSchemas } from "@/entrypoints/services/plugins/types/settings";
import type { Never } from "@/types/utils.types";

export interface PluginsRegistry {}

export type PublicPlugins = {
  [K in PluginId as PluginsRegistry[K] extends PublicPluginManifestExports
    ? K
    : never]: PluginsRegistry[K];
};

type PluginManifestBaseExports = {
  meta: PluginMeta<PluginId>;
  dependencies?: PluginDependencies;
  indexedDbSchemas?: PluginIndexedDbSchemas;
  permissions?: PluginPermissions;
};

type PluginSettingsExports = {
  settingsSchemas: PluginSettingsSchemas;
  settingsStorage: IPluginSettingsService;
};

type PluginDashboardMetaExports = {
  dashboardMeta: PluginDashboardMeta;
};

export type PublicPluginManifestExports = PluginManifestBaseExports &
  PluginDashboardMetaExports &
  PluginSettingsExports;

export type PluginManifestExports = PluginManifestBaseExports &
  (
    | (PluginDashboardMetaExports & PluginSettingsExports)
    | (Partial<Never<PluginDashboardMetaExports>> & PluginSettingsExports)
    | Partial<Never<PluginDashboardMetaExports & PluginSettingsExports>>
  );

export type PluginId = keyof PluginsRegistry;

export {
  type PluginMeta,
  type PluginDependencies,
  type PluginDashboardMeta,
} from "@/entrypoints/services/plugins/types/meta";
export { type PluginPermissions } from "@/entrypoints/services/plugins/types/meta";
export {
  type PluginSettingsSchemas,
  type PluginSettingsSchemaEntry,
} from "@/entrypoints/services/plugins/types/settings";
export {
  type PluginIndexedDbSchemas,
  type PluginIndexedDbSchemaEntry,
} from "@/entrypoints/services/plugins/types/indexed-db";
