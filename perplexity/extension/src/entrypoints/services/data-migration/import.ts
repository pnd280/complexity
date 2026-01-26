import {
  LegacyExtensionDataSchema,
  type LegacyExtensionData,
} from "@/entrypoints/services/data-migration/legacy/types";
import { importExtensionMiscData } from "@/entrypoints/services/data-migration/misc-data";
import { ExtensionDataSchema } from "@/entrypoints/services/data-migration/types";
import {
  importPluginSettings,
  importLegacyPluginSettings,
} from "@/entrypoints/services/data-migration/utils";
import { settingsStorage as extensionIconActionStorage } from "@/entrypoints/services/features/extension-icon-action/settings";
import { db, IndexedDbService } from "@/entrypoints/services/indexed-db";
import { isPluginId } from "@/entrypoints/services/plugins/predicates";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { getPluginManifest } from "@/entrypoints/services/plugins/utils";

export async function importExtensionData(data: string): Promise<void> {
  const jsonData = JSON.parse(data);

  const legacyExtensionData = LegacyExtensionDataSchema.safeParse(jsonData);

  if (legacyExtensionData.success) {
    return importLegacyExtensionData(legacyExtensionData.data);
  }

  const modernData = ExtensionDataSchema.parse(jsonData);
  return importModernExtensionData(modernData);
}

async function importModernExtensionData(
  data: Awaited<ReturnType<typeof ExtensionDataSchema.parse>>,
): Promise<void> {
  await importPluginSettings(data.pluginsSettings);

  await IndexedDbService.import(db, data.indexedDb);

  await importExtensionMiscData(data.misc);
}

async function importLegacyExtensionData(
  data: LegacyExtensionData,
): Promise<void> {
  await importLegacyPluginSettings(data.settings.settings.plugins);

  await importExtensionMiscData({
    [extensionIconActionStorage.key]: {
      settings: data.settings.settings.extensionIconAction,
      meta: {},
    },
  });

  for (const [table, rows] of Object.entries(data.db) as [
    string,
    unknown[],
  ][]) {
    if (rows.length === 0 || !isPluginId(table)) continue;

    const manifest = getPluginManifest(
      table as Parameters<typeof getPluginManifest>[0],
    ) as PluginManifestExports;

    if (manifest.indexedDbSchemas == null) continue;

    await db.table(table).bulkPut(rows);
  }
}
