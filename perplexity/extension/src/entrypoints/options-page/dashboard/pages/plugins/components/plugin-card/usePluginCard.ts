import { useNavigate, useSearchParams } from "react-router-dom";

import { PluginSettingsUis } from "@/__registries__/plugin-settings-uis";
import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId } from "@/__registries__/plugins/meta.types";
import type { PluginTagValues } from "@/data/dashboard/plugin-tags";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import { isCometBrowserSync } from "@/entrypoints/options-page/utils/is-comet";
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

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) => {
        if (!isCometBrowserSync())
          return !(
            ["cometAssistant", "cometAssistantOnly"] as PluginTagValues[]
          ).includes(tag);

        return true;
      }),
    [tags],
  );

  const hasAllRequiredPermissions = useMemo(() => {
    const grantedPermissions = permissions?.permissions ?? [];

    const requiredPermissions = extensionPermissions?.requiredPermissions;

    if (requiredPermissions == null) return true;

    return requiredPermissions.every(({ permission }) =>
      hasPermissionsSync({
        grantedPermissions,
        requiredPermissions: [permission],
      }),
    );
  }, [permissions, extensionPermissions]);

  const dialogContent = useMemo(() => PluginSettingsUis[pluginId], [pluginId]);

  const { pluginsStates, isLoading } = usePluginsStates();

  const areAllDependentPluginsEnabled = useMemo(() => {
    const allDependencies =
      PluginManifestsRegistry.getAllPluginDependencies(pluginId);

    if (allDependencies.size === 0) return true;

    return Array.from(allDependencies).every(
      (dependentPluginId) =>
        settings?.plugins[dependentPluginId].enabled &&
        !pluginsStates[dependentPluginId].isOnMaintenance &&
        !pluginsStates[dependentPluginId].isOutdated,
    );
  }, [pluginId, settings, pluginsStates]);

  const navigateToPluginDetails = useCallback(() => {
    void navigate(
      `/plugins/${uiRouteSegment}?${new URLSearchParams(searchParams)}`,
      {
        state: {
          fromPluginList: true,
        },
      },
    );
  }, [navigate, searchParams, uiRouteSegment]);

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
      tags: filteredTags,
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
