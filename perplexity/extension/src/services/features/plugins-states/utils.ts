import semver from "semver";

import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginId } from "@/data/plugin-registry/types";
import type { FeatureCompatibility } from "@/services/externals/cplx-api/types";
import type { PluginsStates } from "@/services/features/plugins-states/types";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export type PluginStateDetailed = {
  isOutdated: boolean;
  isOnMaintenance: boolean; // if no publicly available newer version
};

export type PluginsStatesDetailed = Record<PluginId, PluginStateDetailed>;

export function initializePluginStates(): PluginsStatesDetailed {
  return (Object.keys(PluginRegistry.manifests) as PluginId[]).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId]: {
        isOutdated: false,
        isOnMaintenance: false,
      } satisfies PluginStateDetailed,
    }),
    {} as PluginsStatesDetailed,
  );
}

export function isPluginOutdated({
  currentVersion,
  requiredVersion,
}: {
  currentVersion: string;
  requiredVersion: string | undefined;
}): boolean {
  if (!requiredVersion) return true;
  return semver.lt(currentVersion, requiredVersion);
}

export function isUpdateAvail({
  requiredVersion,
  latestAvailableVersion,
}: {
  requiredVersion: string | undefined;
  latestAvailableVersion: string | undefined;
}): boolean {
  if (!requiredVersion || !latestAvailableVersion) return false;
  return semver.gt(latestAvailableVersion, requiredVersion);
}

export function updatePluginStatesWithFeatureCompat({
  pluginsStates,
  featureCompat,
  currentVersion,
  latestAvailableVersion,
}: {
  pluginsStates: PluginsStatesDetailed;
  featureCompat: FeatureCompatibility | undefined;
  currentVersion: string;
  latestAvailableVersion: string | undefined;
}): PluginsStatesDetailed {
  if (!featureCompat) return pluginsStates;

  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => {
      const isOutdated = isPluginOutdated({
        currentVersion,
        requiredVersion: featureCompat[pluginId as PluginId],
      });

      return {
        ...acc,
        [pluginId as PluginId]: {
          ...pluginsStates[pluginId as PluginId],
          isOutdated,
          isOnMaintenance:
            isOutdated &&
            !isUpdateAvail({
              requiredVersion: currentVersion,
              latestAvailableVersion,
            }),
        },
      };
    },

    { ...pluginsStates },
  );
}

export function getEnableStates({
  pluginsStates,
  localEnableStates,
}: {
  pluginsStates: PluginsStatesDetailed;
  localEnableStates: ExtensionSettings["plugins"];
}): PluginsStates {
  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId as PluginId]:
        areAllDependenciesAvailable({
          pluginId: pluginId as PluginId,
          pluginsStates,
        }) &&
        !isPluginLockedDown({
          pluginsStates,
          pluginId: pluginId as PluginId,
        }) &&
        localEnableStates[pluginId as PluginId].enabled,
    }),
    {} as PluginsStates,
  );
}

function areAllDependenciesAvailable({
  pluginId,
  pluginsStates,
}: {
  pluginId: PluginId;
  pluginsStates: PluginsStatesDetailed;
}) {
  if (!PluginRegistry.manifests[pluginId]?.dependentPlugins) return true;

  return PluginRegistry.manifests[pluginId]?.dependentPlugins?.every(
    (dependentPluginId) =>
      !pluginsStates[dependentPluginId].isOnMaintenance &&
      !pluginsStates[dependentPluginId].isOutdated,
  );
}

function isPluginLockedDown({
  pluginsStates,
  pluginId,
}: {
  pluginsStates: PluginsStatesDetailed;
  pluginId: PluginId;
}) {
  return (
    pluginsStates[pluginId].isOutdated ||
    pluginsStates[pluginId].isOnMaintenance
  );
}
