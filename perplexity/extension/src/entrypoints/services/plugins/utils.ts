import { PluginsRegistryService } from "@/entrypoints/services/plugins";
import {
  isPluginWithSettings,
  isPublicPlugin,
} from "@/entrypoints/services/plugins/predicates";
import type { PluginSettingsService } from "@/entrypoints/services/plugins/settings";
import type { PluginsSettings } from "@/entrypoints/services/plugins/settings/types";
import type {
  PluginId,
  PublicPluginManifestExports,
} from "@/entrypoints/services/plugins/types";

export function getPluginIds(): PluginId[] {
  return Object.keys(PluginsRegistryService.entries) as PluginId[];
}

export function getPluginManifest<const T extends PluginId>(pluginId: T) {
  return PluginsRegistryService.entries[pluginId];
}

export function getPublicPluginManifests(): Record<
  PluginId,
  PublicPluginManifestExports
> {
  return Object.fromEntries(
    Object.entries(PluginsRegistryService.entries).filter(([pluginId]) =>
      isPublicPlugin(pluginId),
    ),
  ) as Record<PluginId, PublicPluginManifestExports>;
}

export function getPublicPluginManifest<const T extends PluginId>(
  pluginId: T,
): PublicPluginManifestExports {
  const manifest = PluginsRegistryService.entries[pluginId];

  if (!isPublicPlugin(pluginId)) {
    throw new Error(`Plugin ${pluginId} is not a public plugin`);
  }

  return manifest as PublicPluginManifestExports;
}

export function getPluginSettingsStorage<const T extends keyof PluginsSettings>(
  pluginId: T,
): PluginSettingsService<PluginsSettings[T]> {
  return PluginsRegistryService.entries[pluginId]
    .settingsStorage as PluginSettingsService<PluginsSettings[T]>;
}

export const getPluginDependencies = (() => {
  const cache = new Map<PluginId, PluginId[]>();

  return (pluginId: PluginId): PluginId[] => {
    if (cache.has(pluginId)) {
      return cache.get(pluginId)!;
    }

    const pluginDependencies = new Set<PluginId>();
    const visited = new Set<PluginId>();

    function traverse(node: PluginId) {
      const dependencies = PluginsRegistryService.dependenciesGraph.get(node);

      if (!dependencies) return;

      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          visited.add(dep);
          pluginDependencies.add(dep);
          traverse(dep);
        }
      }
    }

    traverse(pluginId);

    const result = Array.from(pluginDependencies);
    cache.set(pluginId, result);

    return result;
  };
})();

export function getPluginPublicDependencies(pluginId: PluginId) {
  return getPluginDependencies(pluginId).filter((dependentPluginId) =>
    isPluginWithSettings(dependentPluginId),
  );
}

export const getPluginDependents = (() => {
  const cache = new Map<PluginId, PluginId[]>();

  return (pluginId: PluginId): PluginId[] => {
    if (cache.has(pluginId)) {
      return cache.get(pluginId)!;
    }

    const pluginDependents = new Set<PluginId>();
    const visited = new Set<PluginId>();

    function traverse(node: PluginId) {
      for (const [
        id,
        dependencies,
      ] of PluginsRegistryService.dependenciesGraph) {
        if (dependencies.has(node) && !visited.has(id)) {
          visited.add(id);
          pluginDependents.add(id);
          traverse(id);
        }
      }
    }

    traverse(pluginId);

    const result = Array.from(pluginDependents);
    cache.set(pluginId, result);

    return result;
  };
})();

export function getPluginPublicDependents(pluginId: PluginId) {
  return getPluginDependents(pluginId).filter((dependentPluginId) =>
    isPluginWithSettings(dependentPluginId),
  );
}
