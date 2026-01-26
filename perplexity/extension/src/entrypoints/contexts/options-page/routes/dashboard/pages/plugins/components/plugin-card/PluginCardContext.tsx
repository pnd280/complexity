import { usePluginCard } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/usePluginCard";
import {
  getLockdownSubText,
  getLockdownText,
  isPluginLockedDown,
} from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/utils";
import { usePluginSettingsUiRegistry } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import usePluginsStates from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginsStates";
import type { PluginTagKeys } from "@/entrypoints/services/plugins/dashboard-meta/types";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";
import type {
  PluginPermissions,
  PublicPlugins,
} from "@/entrypoints/services/plugins/types";
import { getPluginSettingsStorage } from "@/entrypoints/services/plugins/utils";

type PluginCardContextType = {
  pluginId: keyof PublicPlugins;
  pluginInfo: {
    name: string;
    description: React.ReactNode;
    tags: readonly PluginTagKeys[];
    requiredPermissions: PluginPermissions["requiredPermissions"];
  };
  state: {
    isLoading: boolean;
    isEnabled: boolean;
    isLockedDown: boolean;
    areAllDependentPluginsEnabled: boolean;
    hasAllRequiredPermissions: boolean;
    lockdownText: string;
    lockdownSubText: string;
  };
  actions: {
    navigateToPluginDetails: () => void;
    togglePlugin: ({ checked }: { checked: boolean }) => void;
  };
  settingsUi: React.ReactElement | undefined;
};

const PluginCardContext = createContext<PluginCardContextType | null>(null);

export function PluginCardProvider({
  children,
  pluginId,
}: {
  children: React.ReactNode;
  pluginId: keyof PublicPlugins;
}) {
  const { pluginInfo, state, actions } = usePluginCard(pluginId);

  const { pluginsStates } = usePluginsStates();

  const isLockedDown = isPluginLockedDown(pluginId, pluginsStates);
  const lockdownText = getLockdownText(pluginId, pluginsStates);
  const lockdownSubText = getLockdownSubText(pluginId, pluginsStates);

  const isEnabled = usePluginSettings(getPluginSettingsStorage(pluginId))
    .settings.enabled;

  const settingsUi = usePluginSettingsUiRegistry({
    pluginId: pluginId as keyof PublicPlugins,
  });

  const value = {
    pluginId,
    pluginInfo,
    state: {
      ...state,
      isEnabled,
      isLockedDown,
      lockdownText,
      lockdownSubText,
    },
    actions,
    settingsUi,
  } satisfies PluginCardContextType;

  return <PluginCardContext value={value}>{children}</PluginCardContext>;
}

export function usePluginCardContext() {
  const context = use(PluginCardContext);

  invariant(
    context != null,
    "usePluginCardContext must be used within a PluginCardProvider",
  );

  return context;
}
