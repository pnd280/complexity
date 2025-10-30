import { PluginManifestsRegistry } from "@/__registries__/plugins";
import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Ul } from "@/components/ui/typography";
import { usePluginCardContext } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import RequirePermissionsDialogWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/RequirePermissionsDialogWrapper";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

import TablerAlertTriangle from "~icons/tabler/alert-triangle";

export function PluginCardFooter() {
  const {
    pluginId,
    pluginInfo: { requiredPermissions },
    state: {
      dialogContent,
      areAllDependentPluginsEnabled,
      isLockedDown,
      hasAllRequiredPermissions,
    },
    actions: { navigateToPluginDetails, togglePlugin },
  } = usePluginCardContext();

  const { settings } = useExtensionSettings();

  const hasDialogContent = dialogContent != null;

  return (
    <CardFooter className="x:mt-auto x:flex x:justify-between">
      <div className="x:flex x:gap-2">
        {hasDialogContent && (
          <RequirePermissionsDialogWrapper
            asChild
            requiredPermissions={requiredPermissions}
          >
            <Button
              onClick={() => {
                if (!hasAllRequiredPermissions) return;

                navigateToPluginDetails();
              }}
            >
              Details
            </Button>
          </RequirePermissionsDialogWrapper>
        )}
      </div>

      {settings.plugins[pluginId].enabled && !areAllDependentPluginsEnabled && (
        <Tooltip
          content={
            <div className="x:m-2">
              <div>Enable the following plugins:</div>
              <Ul>
                {Array.from(
                  PluginManifestsRegistry.getAllPluginDependencies(pluginId),
                ).map((dependentPluginId) => (
                  <li key={dependentPluginId}>
                    {PluginManifestsRegistry.meta[dependentPluginId].title}
                  </li>
                ))}
              </Ul>
            </div>
          }
        >
          <TablerAlertTriangle className="x:size-4 x:text-yellow-300 x:dark:text-yellow-500" />
        </Tooltip>
      )}

      {!isLockedDown && (
        <RequirePermissionsDialogWrapper
          requiredPermissions={requiredPermissions}
          onGranted={() => {
            togglePlugin({ checked: true });
          }}
        >
          <Switch
            checked={
              hasAllRequiredPermissions
                ? settings.plugins[pluginId].enabled
                : false
            }
            onCheckedChange={({ checked }) => {
              if (!hasAllRequiredPermissions) return;

              togglePlugin({ checked });
            }}
          />
        </RequirePermissionsDialogWrapper>
      )}
    </CardFooter>
  );
}
