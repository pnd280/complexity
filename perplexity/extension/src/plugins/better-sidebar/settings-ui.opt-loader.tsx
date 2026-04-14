import { useEffect, useState } from "react";

import { APP_CONFIG } from "@/app.config";
import { Switch } from "@/components/ui/switch";
import RequirePermissionsDialogWrapper from "@/entrypoints/components/RequirePermissionsDialogWrapper";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { InstantCssService } from "@/entrypoints/services/features/instant-css";
import { permissions } from "@/plugins/better-sidebar/permissions";
import { useSettings } from "@/plugins/better-sidebar/settings";

function BetterSidebarPluginSettingsUi() {
  const { settings, update } = useSettings();

  const [instantCssServiceActive, setInstantCssServiceActive] = useState(false);

  useEffect(() => {
    void InstantCssService.hasPermissions().then(setInstantCssServiceActive);
  }, []);

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn: (draft) => {
              draft.enabled = checked;
            },
          });
        }}
      />

      {settings.enabled && APP_CONFIG.BROWSER === "chrome" && (
        <RequirePermissionsDialogWrapper
          requiredPermissions={permissions.optionalPermissions}
          onGranted={() => {
            void update({
              updateFn: (draft) => {
                draft.shouldPreventLayoutShift = true;
              },
            });
            setInstantCssServiceActive(true);
          }}
        >
          <Switch
            textLabel="Prevent layout shift (highly recommended)"
            checked={
              instantCssServiceActive
                ? settings.shouldPreventLayoutShift
                : false
            }
            onCheckedChange={async ({ checked }) => {
              if (!instantCssServiceActive) return;

              void update({
                updateFn: (draft) => {
                  draft.shouldPreventLayoutShift = checked;
                },
              });
            }}
          />
        </RequirePermissionsDialogWrapper>
      )}
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "betterSidebar",
    ui: <BetterSidebarPluginSettingsUi />,
  });
}
