import { PluginRegistry } from "@/data/plugin-registry";
import type {
  PluginId,
  TypedPluginManifest,
} from "@/data/plugin-registry/types";
import type { UiGroupId } from "@/plugins/_core/ui/groups/types";
import { PluginsStatesService } from "@/services/features/plugins-states";

export function shouldEnableUiGroup({ uiGroup }: { uiGroup: UiGroupId }) {
  const pluginsStates = PluginsStatesService.getEnableStatesCachedSync();

  return Object.entries(PluginRegistry.manifests).some((entry) => {
    const [pluginId, pluginManifest] = entry as [
      PluginId,
      TypedPluginManifest<PluginId>,
    ];

    const isPluginEnabled = pluginsStates[pluginId];

    const haveUiGroupAsDirectDependency =
      pluginManifest.uiGroup?.includes(uiGroup);

    const haveUiGroupAsChildDependency =
      pluginManifest.uiGroup?.find((dependency) =>
        dependency.startsWith(uiGroup),
      ) != null;

    return !!(
      isPluginEnabled &&
      (haveUiGroupAsDirectDependency || haveUiGroupAsChildDependency)
    );
  });
}
