import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type {
  PluginId,
  PluginMeta,
  PluginsSettingsRegistry,
} from "@/__registries__/plugins/meta.types";
import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";

export function shouldEnableUiGroup({
  uiGroup,
  pluginsEnableStates,
}: {
  uiGroup: UiGroupId;
  pluginsEnableStates?: Record<keyof PluginsSettingsRegistry, boolean>;
}) {
  return Object.entries(PluginManifestsRegistry.meta).some((entry) => {
    const [pluginId, pluginManifest] = entry as [
      PluginId,
      PluginMeta<PluginId>,
    ];

    const isPluginEnabled = (pluginsEnableStates ??
      PluginsStatesService.getEnableStatesCachedSync())[pluginId];

    const haveUiGroupAsDirectDependency =
      pluginManifest.dependencies?.uiGroups?.includes(uiGroup) ?? false;

    const haveUiGroupAsChildDependency =
      pluginManifest.dependencies?.uiGroups?.find((dependency: UiGroupId) =>
        dependency.startsWith(uiGroup),
      ) != null;

    return (
      isPluginEnabled &&
      (haveUiGroupAsDirectDependency || haveUiGroupAsChildDependency)
    );
  });
}
