import type { ReactNode } from "react";

import type { PluginSettingsUIs } from "@/__registries__/plugin-settings-uis";
import type { PluginId, PluginMeta } from "@/__registries__/plugins/meta.types";
import type { PluginTagKeys } from "@/data/dashboard/plugin-meta/types";
import { usePluginCard } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/usePluginCard";
import {
  getLockdownSubText,
  getLockdownText,
  isPluginLockedDown,
} from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/usePluginLockdown";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

type PluginCardContextType = {
  pluginId: PluginId;
  pluginInfo: {
    title: string;
    description: ReactNode;
    tags: readonly PluginTagKeys[];
    requiredPermissions: NonNullable<
      PluginMeta<PluginId>["extensionPermissions"]
    >["requiredPermissions"];
  };
  state: {
    isLoading: boolean;
    isEnabled: boolean;
    isLockedDown: boolean;
    areAllDependentPluginsEnabled: boolean;
    hasAllRequiredPermissions: boolean;
    lockdownText: string;
    lockdownSubText: string;
    dialogContent?: PluginSettingsUIs[keyof PluginSettingsUIs];
  };
  actions: {
    navigateToPluginDetails: () => void;
    togglePlugin: ({ checked }: { checked: boolean }) => void;
  };
};

const PluginCardContext = createContext<PluginCardContextType | null>(null);

export function PluginCardProvider({
  children,
  pluginId,
}: {
  children: ReactNode;
  pluginId: PluginId;
}) {
  const { pluginInfo, state, actions } = usePluginCard(pluginId);

  const { pluginsStates } = usePluginsStates();

  const isLockedDown = isPluginLockedDown(pluginId, pluginsStates);
  const lockdownText = getLockdownText(pluginId, pluginsStates);
  const lockdownSubText = getLockdownSubText(pluginId, pluginsStates);

  const isEnabled =
    useExtensionSettings().settings?.plugins[pluginId].enabled ?? false;

  const value = useMemo(
    () =>
      ({
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
      }) satisfies PluginCardContextType,
    [
      pluginId,
      pluginInfo,
      state,
      isEnabled,
      isLockedDown,
      lockdownText,
      lockdownSubText,
      actions,
    ],
  );

  return <PluginCardContext value={value}>{children}</PluginCardContext>;
}

export function usePluginCardContext() {
  const context = use(PluginCardContext);
  if (context === null) {
    throw new Error(
      "usePluginCardContext must be used within a PluginCardProvider",
    );
  }
  return context;
}
