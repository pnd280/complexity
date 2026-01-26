import { storage, type WxtStorageItem } from "@wxt-dev/storage";
import type { ZodObject } from "zod";

import type { LegacyExtensionSettings } from "@/entrypoints/services/data-migration/legacy/types";
import { getLegacyExtensionSettings } from "@/entrypoints/services/data-migration/legacy/utils";
import type { ExtensionData } from "@/entrypoints/services/data-migration/types";
import { isPluginWithSettings } from "@/entrypoints/services/plugins/predicates";
import type {
  PluginId,
  PluginSettingsSchemas,
} from "@/entrypoints/services/plugins/types";
import { getPluginSettingsStorage } from "@/entrypoints/services/plugins/utils";
import { safeMerge } from "@/utils/misc/safe-merge";

type ModernPluginSettingsData = ExtensionData["pluginsSettings"];

type LegacyPluginSettingsData = LegacyExtensionSettings["plugins"];

type StorageItemOperation = {
  key: WxtStorageItem<unknown, never>["key"];
  value: unknown;
};

type StorageMetaOperation = {
  key: WxtStorageItem<unknown, never>["key"];
  meta: Record<string, unknown>;
};

type PluginStorageItem = {
  storageItem: WxtStorageItem<unknown, Record<string, unknown>>;
  settings: unknown;
  meta: unknown;
};

function buildModernPluginSettingsItems(
  pluginSettingsData: ModernPluginSettingsData,
): PluginStorageItem[] {
  return Object.entries(pluginSettingsData)
    .filter(([pluginId]) => isPluginWithSettings(pluginId))
    .map(([pluginId, { settings, meta }]) => {
      const typedPluginId = pluginId as Parameters<
        typeof getPluginSettingsStorage
      >[0];
      return {
        storageItem: getPluginSettingsStorage(typedPluginId).storageItem,
        settings,
        meta,
      };
    });
}

function buildLegacyPluginSettingsItems(
  pluginSettingsData: LegacyPluginSettingsData,
): PluginStorageItem[] {
  return Object.entries(pluginSettingsData)
    .filter(([pluginId]) => isPluginWithSettings(pluginId))
    .map(([pluginId, settings]) => {
      const typedPluginId = pluginId as Parameters<
        typeof getPluginSettingsStorage
      >[0];
      return {
        storageItem: getPluginSettingsStorage(typedPluginId).storageItem,
        settings,
        meta: {},
      };
    });
}

function buildSetItemsOperations(
  items: PluginStorageItem[],
): StorageItemOperation[] {
  return items.map(({ storageItem, settings }) => ({
    key: storageItem.key,
    value: settings,
  }));
}

function buildSetMetasOperations(
  items: PluginStorageItem[],
): StorageMetaOperation[] {
  return items
    .filter(({ meta }) => Object.keys(meta ?? {}).length > 0)
    .map(({ storageItem, meta }) => ({
      key: storageItem.key,
      meta: meta as Record<string, unknown>,
    }));
}

async function migratePluginSettings(
  items: PluginStorageItem[],
): Promise<void> {
  for (const { storageItem } of items) {
    await storageItem.migrate();
  }
}

export async function importPluginSettings(
  pluginSettingsData: ModernPluginSettingsData,
): Promise<void> {
  const pluginItems = buildModernPluginSettingsItems(pluginSettingsData);

  const setItemsOps = buildSetItemsOperations(pluginItems);
  const setMetasOps = buildSetMetasOperations(pluginItems);

  await storage.setItems(setItemsOps);
  await storage.setMetas(setMetasOps);
  await migratePluginSettings(pluginItems);
}

export async function importLegacyPluginSettings(
  pluginSettingsData: LegacyPluginSettingsData,
): Promise<void> {
  const pluginItems = buildLegacyPluginSettingsItems(pluginSettingsData);

  const setItemsOps = buildSetItemsOperations(pluginItems);

  await storage.setItems(setItemsOps);
  await migratePluginSettings(pluginItems);
}

export async function migrateLegacyPluginSettings<
  TValue,
  TSchemasVersions = Record<number, unknown>,
>({
  id,
  settingsSchemas,
  latestVersion,
}: {
  id: PluginId;
  settingsSchemas: PluginSettingsSchemas<TSchemasVersions>;
  latestVersion: number;
}): Promise<TValue | null> {
  const pluginsSettings = await getLegacyExtensionSettings();

  if (pluginsSettings?.plugins[id] != null) {
    const schema = settingsSchemas[latestVersion as keyof TSchemasVersions]
      .schema as unknown as ZodObject;

    return safeMerge(
      schema,
      pluginsSettings.plugins[id],
      settingsSchemas[latestVersion as keyof TSchemasVersions]
        .fallback as Record<string, unknown>,
    ) as TValue;
  }

  return null;
}
