import { useNavigate, useSearchParams } from "react-router-dom";

import { PluginSettingsUis } from "@/__registries__/plugin-settings-uis";
import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId } from "@/__registries__/plugins/meta.types";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import { useExtensionPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/useExtensionPermissions";
import { hasPermissionsSync } from "@/services/infra/extension-api-wrappers/extension-permissions/utils";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export function usePluginCard(pluginId: PluginId) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settings, mutation } = useExtensionSettings();

  const { data: permissions, isLoading: isPermissionsLoading } =
    useExtensionPermissions();

  const {
    title,
    description,
    dashboardMeta: { tags, uiRouteSegment },
    extensionPermissions,
  } = PluginManifestsRegistry.meta[pluginId];

  const hasAllRequiredPermissions = (() => {
    const grantedPermissions = permissions?.permissions ?? [];

    const requiredPermissions = extensionPermissions?.requiredPermissions;

    if (requiredPermissions == null) return true;

    return requiredPermissions.every(({ permission }) =>
      hasPermissionsSync({
        grantedPermissions,
        requiredPermissions: [permission],
      }),
    );
  })();

  const dialogContent = PluginSettingsUis[pluginId];

  const { pluginsStates, isLoading } = usePluginsStates();

  const areAllDependentPluginsEnabled = (() => {
    const allDependencies =
      PluginManifestsRegistry.getAllPluginDependencies(pluginId);

    if (allDependencies.size === 0) return true;

    return Array.from(allDependencies).every(
      (dependentPluginId) =>
        settings.plugins[dependentPluginId].enabled &&
        !pluginsStates[dependentPluginId].isOnMaintenance &&
        !pluginsStates[dependentPluginId].isOutdated,
    );
  })();

  const navigateToPluginDetails = () => {
    void navigate(
      `/plugins/${uiRouteSegment}?${new URLSearchParams(searchParams)}`,
      {
        state: {
          fromPluginList: true,
        },
      },
    );
  };

  const togglePlugin = ({ checked }: { checked: boolean }) => {
    mutation.mutate((draft) => {
      draft.plugins[pluginId].enabled = checked;
    });
  };

  return {
    pluginInfo: {
      title,
      description,
      tags,
      requiredPermissions: extensionPermissions?.requiredPermissions,
    },
    state: {
      settings,
      isLoading: isLoading || isPermissionsLoading,
      hasAllRequiredPermissions,
      dialogContent,
      areAllDependentPluginsEnabled,
    },
    actions: {
      navigateToPluginDetails,
      togglePlugin,
    },
  };
}
