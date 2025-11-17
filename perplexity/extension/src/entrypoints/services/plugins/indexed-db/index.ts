import type Dexie from "dexie";
import { type Table } from "dexie";

import type { VersionsDeclaration } from "@/entrypoints/services/indexed-db/types";
import type {
  PluginId,
  PluginManifestExports,
  PluginsRegistry,
} from "@/entrypoints/services/plugins/types";
import type { MapValue } from "@/types/utils.types";

export function getPluginsVersionsDeclaration({
  latestVersion,
  pluginExports,
}: {
  latestVersion: number;
  pluginExports: PluginsRegistry;
}) {
  const versionsDeclaration: VersionsDeclaration = new Map();

  for (const id of Object.keys(pluginExports) as PluginId[]) {
    const exports = pluginExports[id] as PluginManifestExports;

    if (exports.indexedDbSchemas == null) continue;

    const tableName = exports.meta.id;
    const schemas = exports.indexedDbSchemas.schemas;

    for (const [versionStr, schemaConfig] of Object.entries(schemas)) {
      const version = Number(versionStr);

      invariant(
        version <= latestVersion,
        `Plugin "${tableName}" attempts to declare IndexedDB version ${version}, ` +
          `but the latest supported version is ${latestVersion}. `,
      );

      const existing: MapValue<typeof versionsDeclaration> =
        versionsDeclaration.get(version) ?? {
          schemas: {},
          upgrades: [],
        };

      if (schemaConfig.schema) {
        existing.schemas[tableName] = schemaConfig.schema;
      }

      if (schemaConfig.upgrade) {
        existing.upgrades.push(schemaConfig.upgrade);
      }

      versionsDeclaration.set(version, existing);
    }
  }

  return versionsDeclaration;
}

export function getPluginTable<T>(db: Dexie, tableName: PluginId): Table<T> {
  return db[tableName as keyof Dexie] as Table<T>;
}
