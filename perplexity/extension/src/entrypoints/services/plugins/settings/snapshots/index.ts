import { storage, type WxtStorageItem } from "@wxt-dev/storage";

import { PluginsRegistryService } from "@/entrypoints/services/plugins";
import { isPluginWithSettings } from "@/entrypoints/services/plugins/predicates";
import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";
import type {
  PluginsRegistry,
  PluginManifestExports,
  PluginId,
} from "@/entrypoints/services/plugins/types";
import { isInContentScript } from "@/utils/misc/utils";

export class PluginsSettingSnapshotsService {
  static snapshots: PluginsSettings = {} as PluginsSettings;

  static async getSnapshots(): Promise<PluginsSettings> {
    if (
      isInContentScript() &&
      Object.keys(PluginsSettingSnapshotsService.snapshots).length > 0
    ) {
      return PluginsSettingSnapshotsService.snapshots;
    }

    const storageKeysMap = Object.fromEntries(
      (
        Object.entries(PluginsRegistryService.entries) as [
          PluginId,
          PluginManifestExports,
        ][]
      )
        .map(([pluginId, exports]) => [
          exports.settingsStorage?.storageItem.key,
          pluginId,
        ])
        .filter(([key]) => key != null),
    ) as Record<WxtStorageItem<unknown, never>["key"], keyof PluginsSettings>;

    const snapshots = await storage.getItems(
      Object.keys(storageKeysMap) as WxtStorageItem<unknown, never>["key"][],
    );

    snapshots.forEach((snapshot) => {
      const pluginId = storageKeysMap[snapshot.key];

      if (pluginId == null) return;

      PluginsSettingSnapshotsService.snapshots[pluginId] = snapshot.value;
    });

    return PluginsSettingSnapshotsService.snapshots;
  }

  static async getSnapshotsWithMetas(): Promise<
    Record<
      keyof PluginsSettings,
      { settings: PluginsSettings[keyof PluginsSettings]; meta: unknown }
    >
  > {
    const snapshots = await PluginsSettingSnapshotsService.getSnapshots();

    const storageKeysMap = Object.fromEntries(
      (
        Object.entries(PluginsRegistryService.entries) as [
          PluginId,
          PluginManifestExports,
        ][]
      )
        .map(([pluginId, exports]) => [
          exports.settingsStorage?.storageItem.key,
          pluginId,
        ])
        .filter(([key]) => key != null),
    ) as Record<WxtStorageItem<unknown, never>["key"], keyof PluginsSettings>;

    const metas = await storage.getMetas(
      Object.keys(storageKeysMap) as WxtStorageItem<unknown, never>["key"][],
    );

    const result = {} as Record<
      keyof PluginsSettings,
      { settings: PluginsSettings[keyof PluginsSettings]; meta: unknown }
    >;

    (Object.keys(snapshots) as (keyof PluginsSettings)[]).forEach(
      (pluginId) => {
        const storageKey = (
          Object.entries(storageKeysMap) as [string, keyof PluginsSettings][]
        ).find(([_, id]) => id === pluginId)?.[0];

        const meta = metas.find((m) => m.key === storageKey);

        result[pluginId] = {
          settings: snapshots[pluginId],
          meta: meta?.meta,
        };
      },
    );

    return result;
  }

  static getPluginSnapshot<const T extends keyof PluginsSettings>(
    pluginId: T,
  ): Awaited<ReturnType<PluginsRegistry[T]["settingsStorage"]["getValue"]>> {
    invariant(
      isInContentScript(),
      "[PluginsSettingSnapshotsService] getSnapshot can only be called from the content script",
    );

    return PluginsSettingSnapshotsService.snapshots[pluginId] as Awaited<
      ReturnType<PluginsRegistry[T]["settingsStorage"]["getValue"]>
    >;
  }

  static getPluginsFallbackValues(): PluginsSettings {
    return Object.fromEntries(
      (
        Object.entries(PluginsRegistryService.entries) as [
          PluginId,
          PluginManifestExports,
        ][]
      )
        .filter(([pluginId]) => isPluginWithSettings(pluginId))
        .map(([pluginId, exports]) => {
          return [pluginId, exports.settingsStorage?.storageItem.fallback];
        }),
    ) as PluginsSettings;
  }
}
