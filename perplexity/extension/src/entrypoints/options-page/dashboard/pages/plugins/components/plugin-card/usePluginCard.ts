import { useNavigate, useSearchParams } from "react-router-dom";

import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginId } from "@/data/plugin-registry/types";
import { PLUGIN_SETTINGS_UIS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import { useExtensionPermissions } from "@/services/infra/extension-permissions/useExtensionPermissions";
import { hasPermissionsSync } from "@/services/infra/extension-permissions/utils";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export function usePluginCard(pluginId: PluginId) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { settings, mutation } = useExtensionSettings();

  const { data: permissions, isLoading: isPermissionsLoading } =
    useExtensionPermissions();

  const {
    title,
    description,
    tags,
    settingsUiRouteSegment,
    requiredPermissions,
  } = PluginRegistry.manifests[pluginId];

  const hasAllRequiredPermissions = useMemo(() => {
    const grantedPermissions = permissions?.permissions;

    if (requiredPermissions == null) return true;
    if (grantedPermissions == null) return false;

    return requiredPermissions.every(({ permission }) =>
      hasPermissionsSync({
        grantedPermissions,
        requiredPermissions: [permission],
      }),
    );
  }, [permissions, requiredPermissions]);

  const dialogContent = useMemo(
    () => PLUGIN_SETTINGS_UIS[pluginId],
    [pluginId],
  );

  const { pluginsStates, isLoading } = usePluginsStates();

  const areAllDependentPluginsEnabled = useMemo(
    () =>
      PluginRegistry.manifests?.[pluginId]?.dependentPlugins?.every(
        (dependentPluginId) => settings?.plugins[dependentPluginId].enabled,
      ) ?? true,
    [pluginId, settings],
  );

  const areAnyDependentPluginsDisabled = useMemo(
    () =>
      PluginRegistry.manifests?.[pluginId]?.dependentPlugins?.some(
        (dependentPluginId) =>
          pluginsStates[dependentPluginId].isOnMaintenance ||
          pluginsStates[dependentPluginId].isOutdated,
      ) ?? false,
    [pluginId, pluginsStates],
  );

  const navigateToPluginDetails = useCallback(() => {
    navigate(
      `/plugins/${settingsUiRouteSegment}?${new URLSearchParams(searchParams)}`,
      {
        state: {
          fromPluginList: true,
        },
      },
    );
  }, [navigate, searchParams, settingsUiRouteSegment]);

  const togglePlugin = useCallback(
    ({ checked }: { checked: boolean }) => {
      mutation.mutate((draft) => {
        draft.plugins[pluginId].enabled = checked;
      });
    },
    [mutation, pluginId],
  );

  return {
    pluginInfo: {
      title,
      description,
      tags,
      requiredPermissions,
    },
    state: {
      settings,
      isLoading: isLoading || isPermissionsLoading,
      hasAllRequiredPermissions,
      dialogContent,
      areAllDependentPluginsEnabled,
      areAnyDependentPluginsDisabled,
    },
    actions: {
      navigateToPluginDetails,
      togglePlugin,
    },
  };
}
