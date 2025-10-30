import type { PluginId } from "@/__registries__/plugins/meta.types";
import { APP_CONFIG } from "@/app.config";
import { Switch } from "@/components/ui/switch";
import RequirePermissionsDialogWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/RequirePermissionsDialogWrapper";
import manifest from "@/plugins/better-sidebar/index.manifest";
import { InstantCssService } from "@/services/features/instant-css";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "betterSidebar";

export default function BetterSidebarPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  const [instantCssServiceActive, setInstantCssServiceActive] = useState(false);

  useEffect(() => {
    void InstantCssService.hasPermissions().then(setInstantCssServiceActive);
  }, []);

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.plugins["betterSidebar"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["betterSidebar"].enabled = checked;
          });
        }}
      />

      {settings.plugins["betterSidebar"].enabled &&
        APP_CONFIG.BROWSER === "chrome" && (
          <RequirePermissionsDialogWrapper
            requiredPermissions={[
              manifest.meta.extensionPermissions.optionalPermissions[0],
            ]}
            onGranted={() => {
              mutation.mutate((draft) => {
                draft.plugins["betterSidebar"].shouldPreventLayoutShift = true;
              });
              setInstantCssServiceActive(true);
            }}
          >
            <Switch
              textLabel="Prevent layout shift (highly recommended)"
              checked={
                instantCssServiceActive
                  ? settings.plugins["betterSidebar"].shouldPreventLayoutShift
                  : false
              }
              onCheckedChange={async ({ checked }) => {
                if (!instantCssServiceActive) return;

                mutation.mutate((draft) => {
                  draft.plugins["betterSidebar"].shouldPreventLayoutShift =
                    checked;
                });
              }}
            />
          </RequirePermissionsDialogWrapper>
        )}
    </div>
  );
}
