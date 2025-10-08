import semver from "semver";

import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId } from "@/__registries__/plugins/meta.types";
import type { PluginsEnableStates } from "@/plugins/__async-deps__/plugins-states/types";
import type { FeatureCompatibility } from "@/services/externals/cplx-api/types";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

export type PluginStates = {
  isOutdated: boolean;
  isOnMaintenance: boolean; // if no publicly available newer version
};

export type PluginsStates = Record<PluginId, PluginStates>;

export function initializePluginStates(): PluginsStates {
  return (Object.keys(PluginManifestsRegistry.meta) as PluginId[]).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId]: {
        isOutdated: false,
        isOnMaintenance: false,
      } satisfies PluginStates,
    }),
    {} as PluginsStates,
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
  pluginsStates: PluginsStates;
  featureCompat: FeatureCompatibility | undefined;
  currentVersion: string;
  latestAvailableVersion: string | undefined;
}): PluginsStates {
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
  pluginsStates: PluginsStates;
  localEnableStates: ExtensionSettings["plugins"];
}): PluginsEnableStates {
  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId as PluginId]:
        areAllDependenciesAvailable({
          pluginId: pluginId as PluginId,
          pluginsStates: pluginsStates,
          localEnableStates,
        }) &&
        !isPluginLockedDown({
          pluginsStates: pluginsStates,
          pluginId: pluginId as PluginId,
        }) &&
        localEnableStates[pluginId as PluginId].enabled,
    }),
    {} as PluginsEnableStates,
  );
}

function areAllDependenciesAvailable({
  pluginId,
  pluginsStates,
  localEnableStates,
}: {
  pluginId: PluginId;
  pluginsStates: PluginsStates;
  localEnableStates: ExtensionSettings["plugins"];
}): boolean {
  const allDependencies =
    PluginManifestsRegistry.getAllPluginDependencies(pluginId);

  if (allDependencies.size === 0) return true;

  return Array.from(allDependencies).every(
    (dependentPluginId) =>
      localEnableStates[dependentPluginId].enabled &&
      !pluginsStates[dependentPluginId].isOnMaintenance &&
      !pluginsStates[dependentPluginId].isOutdated,
  );
}

function isPluginLockedDown({
  pluginsStates,
  pluginId,
}: {
  pluginsStates: PluginsStates;
  pluginId: PluginId;
}) {
  return (
    pluginsStates[pluginId].isOutdated ||
    pluginsStates[pluginId].isOnMaintenance
  );
}
