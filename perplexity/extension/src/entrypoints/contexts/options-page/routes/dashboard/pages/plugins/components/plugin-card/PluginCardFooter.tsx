import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Ul } from "@/components/ui/typography";
import RequirePermissionsDialogWrapper from "@/entrypoints/components/RequirePermissionsDialogWrapper";
import { usePluginCardContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import usePluginSettings from "@/entrypoints/services/plugins/settings/usePluginSettings";
import {
  getPluginManifest,
  getPluginSettingsStorage,
  getPluginPublicDependencies,
} from "@/entrypoints/services/plugins/utils";

import TablerAlertTriangle from "~icons/tabler/alert-triangle";

export function PluginCardFooter() {
  const {
    pluginId,
    pluginInfo: { requiredPermissions },
    state: {
      areAllDependentPluginsEnabled,
      isLockedDown,
      hasAllRequiredPermissions,
    },
    actions: { navigateToPluginDetails, togglePlugin },
    settingsUi,
  } = usePluginCardContext();

  const { settings } = usePluginSettings(getPluginSettingsStorage(pluginId));

  const hasSettingsUi = settingsUi != null;

  return (
    <CardFooter className="x:mt-auto x:flex x:justify-between">
      <div className="x:flex x:gap-2">
        <div className={cn({ "x:invisible": !hasSettingsUi })}>
          <RequirePermissionsDialogWrapper
            asChild
            requiredPermissions={requiredPermissions}
          >
            <Button
              onClick={() => {
                if (!hasSettingsUi || !hasAllRequiredPermissions) return;
                navigateToPluginDetails();
              }}
            >
              Details
            </Button>
          </RequirePermissionsDialogWrapper>
        </div>
      </div>

      {settings.enabled && !areAllDependentPluginsEnabled && (
        <Tooltip
          content={
            <div className="x:m-2">
              <div>Enable the following plugins:</div>
              <Ul>
                {getPluginPublicDependencies(pluginId).map(
                  (dependentPluginId) => (
                    <li key={dependentPluginId}>
                      {getPluginManifest(dependentPluginId).meta.name}
                    </li>
                  ),
                )}
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
            checked={hasAllRequiredPermissions ? settings.enabled : false}
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
