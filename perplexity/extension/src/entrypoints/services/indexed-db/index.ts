import Dexie, { type Table } from "dexie";
import { exportDB, importInto, peakImportFile } from "dexie-export-import";

import type { VersionsDeclaration } from "@/entrypoints/services/indexed-db/types";
import { PluginsRegistryService } from "@/entrypoints/services/plugins";
import { getPluginsVersionsDeclaration } from "@/entrypoints/services/plugins/indexed-db";

export class IndexedDbService {
  db: Dexie;

  constructor() {
    this.db = new Dexie("ComplexityDatabase");

    const pluginsVersionsDeclaration = getPluginsVersionsDeclaration({
      latestVersion: IndexedDbService.LATEST_VERSION,
      pluginExports: PluginsRegistryService.entries,
    });

    IndexedDbService.versionsDeclaration = pluginsVersionsDeclaration;

    IndexedDbService.declareVersions(this.db);
  }

  private static LATEST_VERSION = 8;

  static versionsDeclaration: VersionsDeclaration;

  static declareVersions(db: Dexie): void {
    for (const [version, config] of IndexedDbService.versionsDeclaration) {
      db.version(version)
        .stores(config.schemas)
        .upgrade(async (tx) => {
          for (const upgrade of config.upgrades) {
            await upgrade(tx);
          }
        });
    }
  }

  static getTable<T>(db: Dexie, tableName: string): Table<T> {
    return db[tableName as keyof Dexie] as Table<T>;
  }

  static async export(
    db: Dexie,
    excludeTables: string[] = [],
  ): Promise<string> {
    const blob = await exportDB(db, {
      prettyJson: true,
      skipTables: excludeTables,
    });

    return await blob.text();
  }

  static async import(db: Dexie, data: string): Promise<void> {
    let blob = new Blob([data], { type: "application/json" });

    const importMeta = await peakImportFile(blob);
    const importVersion = importMeta.data.databaseVersion;

    if (importVersion < IndexedDbService.LATEST_VERSION) {
      const tempDbName = `ComplexityDatabase_Migration_${Date.now()}_${Math.random()}`;
      try {
        const tempDb = new Dexie(tempDbName);

        for (const [version, config] of IndexedDbService.versionsDeclaration) {
          if (version <= importVersion) {
            tempDb
              .version(version)
              .stores(config.schemas)
              .upgrade(async (tx) => {
                for (const upgrade of config.upgrades) {
                  await upgrade(tx);
                }
              });
          }
        }

        await tempDb.open();
        await importInto(tempDb, blob);
        tempDb.close();

        const tempDbUpgrading = new Dexie(tempDbName);
        IndexedDbService.declareVersions(tempDbUpgrading);
        await tempDbUpgrading.open();

        blob = await exportDB(tempDbUpgrading);
        tempDbUpgrading.close();
      } finally {
        await Dexie.delete(tempDbName);
      }
    }

    await importInto(db, blob, {
      overwriteValues: true,
    });
  }

  static async clear(db: Dexie): Promise<void> {
    for (const table of db.tables) {
      await table.clear();
    }
  }
}

export const db = new IndexedDbService().db;
