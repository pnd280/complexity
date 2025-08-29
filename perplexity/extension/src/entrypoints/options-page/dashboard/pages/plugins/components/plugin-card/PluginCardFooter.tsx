import { LuTriangleAlert } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Ul } from "@/components/ui/typography";
import { PluginRegistry } from "@/data/plugin-registry/index";
import { usePluginCardContext } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import RequirePermissionsDialogWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/RequirePermissionsDialogWrapper";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export function PluginCardFooter() {
  const {
    pluginId,
    pluginInfo: { requiredPermissions },
    state: {
      dialogContent,
      areAllDependentPluginsEnabled,
      areAnyDependentPluginsDisabled,
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

      {settings?.plugins[pluginId].enabled &&
        !areAllDependentPluginsEnabled && (
          <Tooltip
            content={
              <div>
                <div>
                  One or more dependencies are disabled, please enable them to
                  use this plugin:
                </div>
                <Ul>
                  {PluginRegistry.manifests[pluginId]?.dependentPlugins?.map(
                    (dependentPluginId) => (
                      <li key={dependentPluginId}>
                        {PluginRegistry.manifests[dependentPluginId]?.title}
                      </li>
                    ),
                  )}
                </Ul>
              </div>
            }
          >
            <LuTriangleAlert className="x:size-4 x:text-yellow-300 x:dark:text-yellow-500" />
          </Tooltip>
        )}

      {areAnyDependentPluginsDisabled && (
        <Tooltip
          content={
            <div>
              This plugin is disabled because one or more of its dependencies
              are not available.
            </div>
          }
        >
          <LuTriangleAlert className="x:size-4 x:text-destructive" />
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
                ? settings?.plugins[pluginId].enabled
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
