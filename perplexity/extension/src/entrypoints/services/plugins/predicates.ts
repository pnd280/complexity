import { PluginsRegistryService } from "@/entrypoints/services/plugins";
import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";
import type {
  PluginId,
  PluginManifestExports,
  PublicPlugins,
} from "@/entrypoints/services/plugins/types";

export function isPluginId(value: string): value is PluginId {
  return value in PluginsRegistryService.entries;
}

export function isPluginWithSettings(
  value: string,
): value is keyof PluginsSettings {
  if (!isPluginId(value)) return false;

  const manifest = PluginsRegistryService.entries[
    value as PluginId
  ] as PluginManifestExports;

  return manifest.settingsSchemas != null;
}

export function isPublicPlugin(value: string): value is keyof PublicPlugins {
  invariant(isPluginId(value), `[isPublicPlugin] Invalid plugin id: ${value}`);

  const manifest = PluginsRegistryService.entries[
    value as PluginId
  ] as PluginManifestExports;

  return manifest.dashboardMeta != null;
}
