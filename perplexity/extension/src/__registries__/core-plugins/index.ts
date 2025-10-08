import type {
  CorePluginId,
  CorePluginManifest,
  CorePluginMetaMap,
} from "@/__registries__/core-plugins/types";

export default class CorePluginsRegistry {
  static manifest: CorePluginMetaMap = {} as CorePluginMetaMap;
  static corePluginDependenciesCache = new Map<
    CorePluginId,
    Set<CorePluginId>
  >();

  static getAllCorePluginDependencies(
    pluginId: CorePluginId,
  ): Set<CorePluginId> {
    const cached = this.corePluginDependenciesCache.get(pluginId);
    if (cached) return cached;

    const allDeps = new Set<CorePluginId>();
    const visited = new Set<CorePluginId>();

    const collectDeps = (id: CorePluginId) => {
      if (visited.has(id)) return;
      visited.add(id);

      const plugin = this.manifest[id];
      const deps = plugin?.dependencies;

      if (deps) {
        for (const depId of deps) {
          allDeps.add(depId);
          collectDeps(depId);
        }
      }
    };

    collectDeps(pluginId);
    this.corePluginDependenciesCache.set(pluginId, allDeps);
    return allDeps;
  }

  static register(manifest: CorePluginManifest<CorePluginId>) {
    (this.manifest as Record<CorePluginId, CorePluginManifest<CorePluginId>>)[
      manifest.id
    ] = manifest;
  }
}

(function () {
  const entries = import.meta.glob(
    "@/plugins/__core__/**/index.manifest.core.ts",
    {
      eager: true,
    },
  ) as Record<string, Record<string, unknown>>;

  for (const [_path, module] of Object.entries(entries)) {
    const params = module.default as CorePluginManifest<CorePluginId>;

    CorePluginsRegistry.register(params);
  }

  (function detectCycleAndBuildCache() {
    const visiting = new Set<CorePluginId>();
    const visited = new Set<CorePluginId>();
    const tempDepsMap = new Map<CorePluginId, Set<CorePluginId>>();

    function visit(
      pluginId: CorePluginId,
      path: CorePluginId[],
    ): Set<CorePluginId> {
      if (visiting.has(pluginId)) {
        const cycleStart = path.indexOf(pluginId);
        const cycle = [...path.slice(cycleStart), pluginId].join(" -> ");
        throw new Error(`Dependency cycle detected in core plugins: ${cycle}`);
      }

      const cached = tempDepsMap.get(pluginId);
      if (cached) return cached;

      if (visited.has(pluginId)) {
        return tempDepsMap.get(pluginId) ?? new Set();
      }

      visiting.add(pluginId);
      path.push(pluginId);

      const allDeps = new Set<CorePluginId>();
      const plugin = CorePluginsRegistry.manifest[pluginId];

      if (plugin?.dependencies) {
        for (const dep of plugin.dependencies) {
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
      CorePluginsRegistry.manifest,
    ) as CorePluginId[]) {
      if (!visited.has(pluginId)) {
        visit(pluginId, []);
      }
    }

    CorePluginsRegistry.corePluginDependenciesCache = tempDepsMap;
  })();
})();
