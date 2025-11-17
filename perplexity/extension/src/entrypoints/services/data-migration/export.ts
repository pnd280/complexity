import { exportExtensionMiscDataSettings } from "@/entrypoints/services/data-migration/misc-data";
import type { ExtensionData } from "@/entrypoints/services/data-migration/types";
import { db, IndexedDbService } from "@/entrypoints/services/indexed-db";
import { PluginsRegistryService } from "@/entrypoints/services/plugins";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import type {
  PluginId,
  PluginManifestExports,
} from "@/entrypoints/services/plugins/types";

export async function exportExtensionData(): Promise<string> {
  const exportData: ExtensionData = {
    pluginsSettings:
      await PluginsSettingSnapshotsService.getSnapshotsWithMetas(),
    indexedDb: await IndexedDbService.export(
      db,
      (
        Object.entries(PluginsRegistryService.entries) as [
          PluginId,
          PluginManifestExports,
        ][]
      ).reduce((acc, [pluginId, exports]) => {
        if (exports.indexedDbSchemas?.options?.exportable === false) {
          return [...acc, pluginId];
        }
        return acc;
      }, [] as PluginId[]),
    ),
    misc: await exportExtensionMiscDataSettings(),
  };

  return JSON.stringify(exportData, null, 2);
}
