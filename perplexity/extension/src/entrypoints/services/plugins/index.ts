import { APP_CONFIG } from "@/app.config";
import { pluginManifestsImports } from "@/entrypoints/registries/plugins";
import type {
  PluginId,
  PluginManifestExports,
  PluginsRegistry,
} from "@/entrypoints/services/plugins/types";

export class PluginsRegistryService {
  static entries = (
    Object.values(pluginManifestsImports) as PluginManifestExports[]
  ).reduce<PluginsRegistry>((acc, exports) => {
    if (!exports.meta.devOnly || APP_CONFIG.IS_DEV) {
      (acc as Record<PluginId, PluginManifestExports>)[exports.meta.id] =
        exports;
    }
    return acc;
  }, {} as PluginsRegistry);

  static dependenciesGraph = (() => {
    const dependenciesGraph = new Map<PluginId, Set<PluginId>>();

    for (const [id, exports] of Object.entries(
      PluginsRegistryService.entries as Record<PluginId, PluginManifestExports>,
    )) {
      const dependencies = exports.dependencies?.plugins ?? [];
      dependenciesGraph.set(id as PluginId, new Set(dependencies));
    }

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (node: string, path: string[] = []): boolean => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const deps = dependenciesGraph.get(node as PluginId);
      if (deps) {
        for (const dep of deps) {
          if (!visited.has(dep)) {
            if (hasCycle(dep, path)) return true;
          } else if (recursionStack.has(dep)) {
            path.push(dep);
            throw new Error(
              `[PluginsRegistry] Dependency cycle detected: ${path.join(" -> ")}`,
            );
          }
        }
      }

      path.pop();
      recursionStack.delete(node);
      return false;
    };

    for (const id of dependenciesGraph.keys()) {
      if (!visited.has(id)) {
        hasCycle(id);
      }
    }

    return dependenciesGraph;
  })();
}
