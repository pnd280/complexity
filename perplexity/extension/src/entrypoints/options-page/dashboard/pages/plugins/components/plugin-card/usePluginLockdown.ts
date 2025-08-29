import type { PluginId } from "@/data/plugin-registry/types";
import type { PluginsStatesDetailed } from "@/services/features/plugins-states/utils";

export function isPluginLockedDown(
  pluginId: PluginId,
  pluginsStates: PluginsStatesDetailed,
) {
  return (
    pluginsStates[pluginId].isOutdated ||
    pluginsStates[pluginId].isOnMaintenance
  );
}

export function getLockdownText(
  pluginId: PluginId,
  pluginsStates: PluginsStatesDetailed,
) {
  const { isOutdated, isOnMaintenance } = pluginsStates[pluginId];

  if (isOnMaintenance) return "This plugin is on maintenance";
  if (isOutdated) return "This plugin is outdated";

  return "";
}

export function getLockdownSubText(
  pluginId: PluginId,
  pluginsStates: PluginsStatesDetailed,
) {
  const { isOutdated, isOnMaintenance } = pluginsStates[pluginId];

  if (isOnMaintenance) return "Please check back later";
  if (isOutdated) return "Please update the extension";

  return "";
}
