import { Dexie, type Table } from "dexie";

import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import { legacyThemeMigration } from "@/data/dashboard/themes/migration";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { PluginTables } from "@/data/registries/plugins/meta.types";
import type { QueryCacheEntry } from "@/services/infra/query-client/utils";

export class IndexedDbService extends Dexie {
  queryCache!: Table<QueryCacheEntry>;
  themes!: Table<Theme>;

  static readonly EXCLUDED_FROM_EXPORT = new Set(["queryCache"]);

  constructor() {
    super("ComplexityDatabase");

    const allVersions = new Map<
      number,
      {
        schemas: Record<string, string>;
        upgrades: Array<(tx: any) => Promise<void> | void>;
      }
    >();

    allVersions.set(6, {
      schemas: {
        queryCache: "&key, timestamp",
        themes: "&id, title, author",
      },
      upgrades: [],
    });

    allVersions.set(7, {
      schemas: {},
      upgrades: [
        (tx) => tx.table("themes").toCollection().modify(legacyThemeMigration),
      ],
    });

    // Overlay plugin schemas onto existing versions or create new ones
    for (const [versionNum, pluginVersionData] of Object.entries(
      PluginManifestsRegistry.indexedDbVersions,
    )) {
      const version = Number(versionNum);
      const existing = allVersions.get(version) || {
        schemas: {},
        upgrades: [],
      };

      Object.assign(existing.schemas, pluginVersionData.schemas);

      existing.upgrades.push(...pluginVersionData.upgrades);

      allVersions.set(version, existing);
    }

    const sortedVersions = Array.from(allVersions.keys()).sort((a, b) => a - b);

    for (const versionNum of sortedVersions) {
      const versionData = allVersions.get(versionNum)!;

      this.version(versionNum)
        .stores(versionData.schemas)
        .upgrade(async (tx) => {
          for (const upgradeFunc of versionData.upgrades) {
            await upgradeFunc(tx);
          }
        });
    }
  }

  async exportAll(): Promise<ExtensionData["db"]> {
    const result: Record<string, any[]> = {};

    for (const table of this.tables) {
      if (!IndexedDbService.EXCLUDED_FROM_EXPORT.has(table.name)) {
        result[table.name] = await table.toArray();
      }
    }

    return result as ExtensionData["db"];
  }

  async import(data: ExtensionData["db"]) {
    for (const [tableName, records] of Object.entries(data)) {
      if (
        Array.isArray(records) &&
        !IndexedDbService.EXCLUDED_FROM_EXPORT.has(tableName)
      ) {
        const table = (this as any)[tableName];
        if (table != null) {
          await table.bulkPut(records);
        }
      }
    }
  }

  async clearAll() {
    for (const table of this.tables) {
      await table.clear();
    }
  }
}

export const db = new IndexedDbService() as IndexedDbService & PluginTables;
