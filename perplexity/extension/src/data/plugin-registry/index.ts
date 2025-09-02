/**
 * ⚠️ IMPORTANT ⚠️
 *
 * This file should NOT contain any dynamic imports.
 * All imports must be static to ensure proper bundling and initialization.
 * Dynamic imports in this file can cause plugin registration issues and
 * lead to unpredictable behavior across different extension contexts.
 */

import type { Transaction } from "dexie";
import { z } from "zod";

import { APP_CONFIG } from "@/app.config";
import type {
  PluginManifestsMap,
  PluginsSettingsRegistry,
  PluginsSettingsSchema,
} from "@/data/plugin-registry/types";
import type { DefinePluginParams } from "@/data/plugin-registry/utils";
import { invariant } from "@/utils/utils";

export class PluginRegistry {
  static manifests: PluginManifestsMap = {} as PluginManifestsMap;
  static zodSchema = z.object({});
  static fallbackValues = {} as PluginsSettingsSchema;

  static readonly LATEST_INDEXED_DB_VERSION = 7;
  static indexedDbVersions: Record<
    number,
    {
      schemas: Record<string, string>;
      upgrades: Array<(tx: Transaction) => Promise<void> | void>;
    }
  > = {};
  static indexedDbTableValidationSchemas: Record<string, z.ZodType<any>> = {};
}

(() => {
  const entries = import.meta.glob("@/plugins/!(_core)/index.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>;

  for (const [path, module] of Object.entries(entries)) {
    invariant("default" in module, `Plugin "${path}" has no default export`);

    const params = module.default as DefinePluginParams<
      keyof PluginsSettingsRegistry
    >;

    invariant(params != null, `Plugin "${path}" has no definition`);

    if (!APP_CONFIG.IS_DEV && params.manifest.devOnly) continue;

    (PluginRegistry.manifests as any)[params.manifest.id] = params.manifest;

    PluginRegistry.zodSchema = PluginRegistry.zodSchema.extend({
      [params.manifest.id]: params.settingsSchema.schema,
    });
    (PluginRegistry.fallbackValues as any)[params.manifest.id] =
      params.settingsSchema.fallback;

    // Accumulate IndexedDB schemas by version, preventing conflicts
    if (params.indexedDb) {
      PluginRegistry.indexedDbTableValidationSchemas[params.manifest.id] =
        params.indexedDb.schema;

      for (const versionConfig of params.indexedDb.versions) {
        const { version, schema, upgrade } = versionConfig;

        invariant(
          version <= PluginRegistry.LATEST_INDEXED_DB_VERSION,
          `Plugin "${params.manifest.id}" attempts to declare IndexedDB version ${version}, ` +
            `but the latest supported version is ${PluginRegistry.LATEST_INDEXED_DB_VERSION}. ` +
            `Please manually increase PluginRegistry.LATEST_INDEXED_DB_VERSION and review the schema changes.`,
        );

        if (!PluginRegistry.indexedDbVersions[version]) {
          PluginRegistry.indexedDbVersions[version] = {
            schemas: {},
            upgrades: [],
          };
        }

        const existingSchemas =
          PluginRegistry.indexedDbVersions[version].schemas;

        invariant(
          !(params.manifest.id in existingSchemas),
          `IndexedDB schema collision: Table "${params.manifest.id}" is already defined for version ${version}. ` +
            `Plugin "${params.manifest.id}" attempted to redefine it.`,
        );

        existingSchemas[params.manifest.id] = schema;

        if (upgrade) {
          PluginRegistry.indexedDbVersions[version].upgrades.push(upgrade);
        }
      }
    }
  }
})();
