import { useQueries } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import usePluginsStates from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginsStates";
import { extensionSettingsQueries } from "@/entrypoints/hooks/useSettingsBase";
import { useExtensionPermissions } from "@/entrypoints/services/extension-api-wrappers/permissions/useExtensionPermissions";
import { hasPermissionsSync } from "@/entrypoints/services/extension-api-wrappers/permissions/utils";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";
import type {
  PluginManifestExports,
  PublicPlugins,
} from "@/entrypoints/services/plugins/types";
import {
  getPluginPublicDependencies,
  getPluginSettingsStorage,
  getPublicPluginManifest,
} from "@/entrypoints/services/plugins/utils";

export function usePluginCard(pluginId: keyof PublicPlugins) {
  const navigate = useNavigate();
  const { search } = useLocation();

  const { settings, update } = usePluginSettings(
    getPluginSettingsStorage(pluginId),
  );

  const { data: permissions, isLoading: isPermissionsLoading } =
    useExtensionPermissions();

  const manifest = getPublicPluginManifest(pluginId);

  const { name, description } = manifest.meta;
  const { tags, uiRouteSegment } = manifest.dashboardMeta;
  const extensionPermissions = (manifest as PluginManifestExports).permissions;

  const hasAllRequiredPermissions = (() => {
    const grantedPermissions = permissions?.permissions ?? [];

    const requiredPermissions = extensionPermissions?.requiredPermissions;

    if (requiredPermissions == null) return true;

    return requiredPermissions.every(({ permissions }) =>
      hasPermissionsSync({
        grantedPermissions,
        requiredPermissions: permissions,
      }),
    );
  })();

  const allDependencies = getPluginPublicDependencies(pluginId);

  const allDependenciesEnabled = useQueries({
    queries: Array.from(allDependencies).map((dependentPluginId) => {
      const storageItem =
        getPluginSettingsStorage(dependentPluginId).storageItem;

      return extensionSettingsQueries.settings.details({
        key: storageItem.key,
        storage: storageItem,
      });
    }),
  }).every((query) => query.data?.enabled ?? false);

  const { pluginsStates, isLoading } = usePluginsStates();

  const allDependentPluginsAvailable = (() => {
    if (allDependencies.length === 0) return true;

    return Array.from(allDependencies).every(
      (dependentPluginId) =>
        !pluginsStates[dependentPluginId].isOnMaintenance &&
        !pluginsStates[dependentPluginId].isOutdated,
    );
  })();

  const areAllDependentPluginsEnabled =
    allDependenciesEnabled && allDependentPluginsAvailable;

  const navigateToPluginDetails = () => {
    void navigate(`/plugins/${uiRouteSegment}${search}`);
  };

  const togglePlugin = ({ checked }: { checked: boolean }) => {
    void update({
      updateFn(prev) {
        prev.enabled = checked;
      },
    });
  };

  return {
    pluginInfo: {
      name,
      description,
      tags,
      requiredPermissions: extensionPermissions?.requiredPermissions,
    },
    state: {
      settings,
      isLoading: isLoading || isPermissionsLoading,
      hasAllRequiredPermissions,
      areAllDependentPluginsEnabled,
    },
    actions: {
      navigateToPluginDetails,
      togglePlugin,
    },
  };
}
