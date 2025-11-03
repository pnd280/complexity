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

import type {
  PluginId,
  PluginIndexedDbConfig,
  PluginMeta,
  PluginMetaMap,
  PluginsSettingsRegistry,
} from "@/__registries__/plugins/meta.types";
import type { PluginManifest } from "@/__registries__/plugins/types";
import { APP_CONFIG } from "@/app.config";
import { invariant } from "@/utils/misc/utils";

export class PluginManifestsRegistry {
  static meta: PluginMetaMap = {} as PluginMetaMap;
  static settingsZodSchema = z.object({});
  static settingsFallbackValues = {} as PluginsSettingsRegistry;
  private static LATEST_INDEXED_DB_VERSION = 8;
  static indexedDbVersions: Record<
    number,
    {
      schemas: Record<string, string>;
      upgrades: Array<(tx: Transaction) => Promise<void> | void>;
    }
  > = {};
  static indexedDbTableValidationSchemas: Record<string, z.ZodType<unknown>> =
    {};

  static pluginDependenciesCache = new Map<PluginId, Set<PluginId>>();

  static getAllPluginDependencies(pluginId: PluginId): Set<PluginId> {
    const cached = this.pluginDependenciesCache.get(pluginId);
    if (cached) return cached;

    // If cache miss, compute dependencies for this plugin
    const allDeps = new Set<PluginId>();
    const visited = new Set<PluginId>();

    const collectDeps = (id: PluginId) => {
      if (visited.has(id)) return;
      visited.add(id);

      const plugin = this.meta[id];
      const deps = plugin.dependencies?.plugins;

      if (deps) {
        for (const depId of deps) {
          allDeps.add(depId);
          collectDeps(depId);
        }
      }
    };

    collectDeps(pluginId);
    this.pluginDependenciesCache.set(pluginId, allDeps);
    return allDeps;
  }

  static register<T extends PluginId>(params: {
    id: T;
    manifest: PluginMeta<T>;
    settingsSchema: z.ZodType;
    settingsFallback: PluginsSettingsRegistry[T] | z.input<z.ZodType>;
    indexedDb?: PluginIndexedDbConfig;
  }): void {
    (this.meta as Record<T, PluginMeta<T>>)[params.id] = params.manifest;

    this.settingsZodSchema = this.settingsZodSchema.extend({
      [params.id]: params.settingsSchema,
    });

    (this.settingsFallbackValues as Record<T, PluginsSettingsRegistry[T]>)[
      params.id
    ] = params.settingsFallback as PluginsSettingsRegistry[T];

    // Accumulate IndexedDB schemas by version, preventing conflicts
    if (params.indexedDb) {
      if (params.indexedDb.schema) {
        this.indexedDbTableValidationSchemas[params.id] =
          params.indexedDb.schema;
      }

      const sortedVersions = [...params.indexedDb.versions].sort(
        (a, b) => a.version - b.version,
      );

      for (const versionConfig of sortedVersions) {
        const { version, schema, tableName, upgrade } = versionConfig;

        invariant(
          version <= this.LATEST_INDEXED_DB_VERSION,
          `Plugin "${params.id}" attempts to declare IndexedDB version ${version}, ` +
            `but the latest supported version is ${this.LATEST_INDEXED_DB_VERSION}. ` +
            `Please manually increase LATEST_INDEXED_DB_VERSION and review the schema changes.`,
        );

        if (!schema) {
          if (!this.indexedDbVersions[version]) {
            this.indexedDbVersions[version] = {
              schemas: {},
              upgrades: [],
            };
          }

          if (upgrade) {
            this.indexedDbVersions[version].upgrades.push(upgrade);
          }
          continue;
        }

        if (!this.indexedDbVersions[version]) {
          this.indexedDbVersions[version] = {
            schemas: {},
            upgrades: [],
          };
        }

        const existingSchemas = this.indexedDbVersions[version].schemas;

        let finalTableName = tableName;
        if (!finalTableName) {
          for (let prevVersion = version - 1; prevVersion >= 1; prevVersion--) {
            const prevVersionData = this.indexedDbVersions[prevVersion];
            if (prevVersionData?.schemas) {
              const prevPluginVersion = sortedVersions.find(
                (v) => v.version === prevVersion,
              );
              if (prevPluginVersion) {
                if (prevPluginVersion.tableName) {
                  finalTableName = prevPluginVersion.tableName;
                  break;
                }
                if (params.id in prevVersionData.schemas) {
                  finalTableName = params.id;
                  break;
                }
              }
            }
          }
          finalTableName = finalTableName ?? params.id;
        }

        invariant(
          !(finalTableName in existingSchemas),
          `IndexedDB schema collision: Table "${finalTableName}" is already defined for version ${version}. ` +
            `Plugin "${params.id}" attempted to redefine it.`,
        );

        existingSchemas[finalTableName] = schema;

        if (upgrade) {
          this.indexedDbVersions[version].upgrades.push(upgrade);
        }
      }
    }
  }
}

(function () {
  const entries = import.meta.glob("@/plugins/*/index.manifest.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>;

  const sortedEntries = Object.entries(entries)
    .map(([path, module]) => {
      const params = module.default as PluginManifest<
        keyof PluginsSettingsRegistry
      >;

      return { path, params };
    })
    .sort((a, b) => a.params.meta.title.localeCompare(b.params.meta.title));

  for (const { params } of sortedEntries) {
    if (!APP_CONFIG.IS_DEV && params.meta.devOnly) continue;

    PluginManifestsRegistry.register({
      id: params.meta.id,
      manifest: params.meta,
      settingsSchema: params.settingsSchema.schema,
      settingsFallback: params.settingsSchema.fallback,
      indexedDb: params.indexedDb,
    });
  }

  (function detectCycleAndBuildCache() {
    const visiting = new Set<PluginId>();
    const visited = new Set<PluginId>();
    const tempDepsMap = new Map<PluginId, Set<PluginId>>();

    function visit(pluginId: PluginId, path: PluginId[]): Set<PluginId> {
      if (visiting.has(pluginId)) {
        const cycleStart = path.indexOf(pluginId);
        const cycle = [...path.slice(cycleStart), pluginId].join(" -> ");
        throw new Error(`Dependency cycle detected in plugins: ${cycle}`);
      }

      const cached = tempDepsMap.get(pluginId);
      if (cached) return cached;

      if (visited.has(pluginId)) {
        return tempDepsMap.get(pluginId) ?? new Set();
      }

      visiting.add(pluginId);
      path.push(pluginId);

      const allDeps = new Set<PluginId>();
      const plugin = PluginManifestsRegistry.meta[pluginId];

      if (plugin.dependencies?.plugins) {
        for (const dep of plugin.dependencies.plugins) {
          allDeps.add(dep);
          const transitiveDeps = visit(dep, path);
          transitiveDeps.forEach((d) => allDeps.add(d));
        }
      }

      path.pop();
      visiting.delete(pluginId);
      visited.add(pluginId);

      tempDepsMap.set(pluginId, allDeps);
      return allDeps;
    }

    for (const pluginId of Object.keys(
      PluginManifestsRegistry.meta,
    ) as PluginId[]) {
      if (!visited.has(pluginId)) {
        visit(pluginId, []);
      }
    }

    PluginManifestsRegistry.pluginDependenciesCache = tempDepsMap;
  })();
})();
