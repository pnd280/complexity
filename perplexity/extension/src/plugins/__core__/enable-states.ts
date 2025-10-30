import CorePluginsRegistry from "@/__registries__/core-plugins";
import type {
  CorePluginId,
  CorePluginManifest,
  CorePluginsEnableStates,
} from "@/__registries__/core-plugins/types";
import { PluginManifestsRegistry } from "@/__registries__/plugins";
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
        return [
          id,
          Object.values(PluginManifestsRegistry.meta).some((plugin) => {
            if (
              !(pluginsEnableStates ??
                PluginsStatesService.getEnableStatesCachedSync())[plugin.id]
            )
              return false;
            return plugin.dependencies?.corePlugins?.includes(
              id as CorePluginId,
            );
          }),
        ];
      }),
    ) as CorePluginsEnableStates;

    for (const [id] of Object.entries(CorePluginsRegistry.manifest) as [
      CorePluginId,
      CorePluginManifest<CorePluginId>,
    ][]) {
      enabledStates[id] =
        enabledStates[id] ||
        CorePluginsRegistry.corePluginDependenciesCache
          .entries()
          .some((deps) => enabledStates[deps[0]] && deps[1].has(id));
    }

    CorePluginsEnableStatesService.enableStates = enabledStates;

    return enabledStates;
  }
}
