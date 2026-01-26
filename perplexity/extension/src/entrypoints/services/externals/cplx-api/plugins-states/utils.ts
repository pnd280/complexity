import semver from "semver";

import type {
  FeatureCompatibility,
  PluginsEnableStates,
} from "@/entrypoints/services/externals/cplx-api/plugins-states/types";
import { PluginsRegistryService } from "@/entrypoints/services/plugins";
import { isPublicPlugin } from "@/entrypoints/services/plugins/predicates";
import type { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import type {
  PluginId,
  PluginManifestExports,
} from "@/entrypoints/services/plugins/types";
import {
  getPluginDependencies,
  getPluginDependents,
  getPluginIds,
} from "@/entrypoints/services/plugins/utils";

export type PluginStates = {
  isOutdated: boolean;
  isOnMaintenance: boolean; // if no publicly available newer version
};

export type PluginsStates = Record<PluginId, PluginStates>;

export type LocalEnableStates = Record<PluginId, boolean>;

export async function initializeLocalEnableStates(
  pluginSettingSnapshots: typeof PluginsSettingSnapshotsService.snapshots,
): Promise<LocalEnableStates> {
  const localEnableStates: LocalEnableStates = {} as LocalEnableStates;

  for (const pluginId of getPluginIds()) {
    if (isPublicPlugin(pluginId)) {
      localEnableStates[pluginId] = pluginSettingSnapshots[pluginId].enabled;
    } else {
      localEnableStates[pluginId] = true;
    }
  }

  return localEnableStates;
}

export function initializePluginStates(): PluginsStates {
  return getPluginIds().reduce(
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
      const isCorePlugin =
        (
          PluginsRegistryService.entries[
            pluginId as PluginId
          ] as PluginManifestExports
        ).dashboardMeta == null;

      if (isCorePlugin) {
        return {
          ...acc,
          [pluginId as PluginId]: {
            ...pluginsStates[pluginId as PluginId],
            isOutdated: false,
            isOnMaintenance: false,
          },
        };
      }

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
  localEnableStates: LocalEnableStates;
}): PluginsEnableStates {
  const result: PluginsEnableStates = localEnableStates;

  for (const pluginId of Object.keys(pluginsStates) as PluginId[]) {
    if (!isPublicPlugin(pluginId)) continue;

    result[pluginId] =
      !isPublicPlugin(pluginId) ||
      (areAllDependenciesAvailable({
        pluginId,
        pluginsStates: pluginsStates,
        localEnableStates,
      }) &&
        !isPluginUnavailable({
          pluginsStates: pluginsStates,
          pluginId,
        }) &&
        localEnableStates[pluginId]);
  }

  for (const pluginId of Object.keys(pluginsStates) as PluginId[]) {
    if (isPublicPlugin(pluginId)) continue;

    result[pluginId] = getPluginDependents(pluginId)
      .filter(isPublicPlugin)
      .some((pluginId) => result[pluginId]);
  }

  return result;
}

function areAllDependenciesAvailable({
  pluginId,
  pluginsStates,
  localEnableStates,
}: {
  pluginId: PluginId;
  pluginsStates: PluginsStates;
  localEnableStates: LocalEnableStates;
}): boolean {
  return getPluginDependencies(pluginId).every(
    (dependentPluginId) =>
      (!isPublicPlugin(dependentPluginId) ||
        localEnableStates[dependentPluginId]) &&
      !isPluginUnavailable({
        pluginId: dependentPluginId,
        pluginsStates,
      }),
  );
}

function isPluginUnavailable({
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
