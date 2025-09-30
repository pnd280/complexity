import CorePluginsRegistry from "@/data/registries/core-plugins";
import type {
  CorePluginId,
  CorePluginManifest,
  CorePluginsEnableStates,
} from "@/data/registries/core-plugins/types";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";
import type { PluginsEnableStates } from "@/plugins/__async-deps__/plugins-states/types";

export default class CorePluginsEnableStatesService {
  private static enableStates: CorePluginsEnableStates | null = null;

  static getEnableStates({
    pluginsEnableStates,
  }: {
    pluginsEnableStates?: PluginsEnableStates;
  }): CorePluginsEnableStates {
    if (CorePluginsEnableStatesService.enableStates != null)
      return CorePluginsEnableStatesService.enableStates;

    const enabledStates = Object.fromEntries(
      Object.entries(CorePluginsRegistry.manifest).map(([id]) => {
        return [id, false];
      }),
    ) as CorePluginsEnableStates;

    for (const [id, _manifest] of Object.entries(
      CorePluginsRegistry.manifest,
    ) as [CorePluginId, CorePluginManifest<CorePluginId>][]) {
      const isUsedByPlugins = Object.values(PluginManifestsRegistry.meta).some(
        (plugin) => {
          if (
            !(pluginsEnableStates ??
              PluginsStatesService.getEnableStatesCachedSync())[plugin.id]
          )
            return false;
          return plugin.dependencies?.corePlugins?.includes(id);
        },
      );

      if (isUsedByPlugins) {
        enabledStates[id] = true;
        continue;
      }

      const isUsedByCorePlugins = Object.values(
        CorePluginsRegistry.manifest,
      ).some((corePlugin) => {
        if (!enabledStates[corePlugin.id]) return false;
        const allCoreDeps = CorePluginsRegistry.getAllCorePluginDependencies(
          corePlugin.id,
        );
        return allCoreDeps.has(id);
      });

      if (isUsedByCorePlugins) {
        enabledStates[id] = true;
        continue;
      }
    }

    CorePluginsEnableStatesService.enableStates = enabledStates;

    return enabledStates;
  }
}
