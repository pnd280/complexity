import type { PluginId } from "@/data/registries/plugins/meta.types";
import type { PluginsStates } from "@/plugins/__async-deps__/plugins-states/utils";

export function isPluginLockedDown(
  pluginId: PluginId,
  pluginsStates: PluginsStates,
) {
  return (
    pluginsStates[pluginId].isOutdated ||
    pluginsStates[pluginId].isOnMaintenance
  );
}

export function getLockdownText(
  pluginId: PluginId,
  pluginsStates: PluginsStates,
) {
  const { isOutdated, isOnMaintenance } = pluginsStates[pluginId];

  if (isOnMaintenance) return "This plugin is on maintenance";
  if (isOutdated) return "This plugin is outdated";

  return "";
}

export function getLockdownSubText(
  pluginId: PluginId,
  pluginsStates: PluginsStates,
) {
  const { isOutdated, isOnMaintenance } = pluginsStates[pluginId];

  if (isOnMaintenance) return "Please check back later";
  if (isOutdated) return "Please update the extension";

  return "";
}
