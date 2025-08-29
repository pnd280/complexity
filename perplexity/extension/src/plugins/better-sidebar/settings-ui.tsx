import { APP_CONFIG } from "@/app.config";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import RequirePermissionsDialogWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/RequirePermissionsDialogWrapper";
import manifest from "@/plugins/better-sidebar";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";
import { InstantCssService } from "@/services/features/instant-css";

export const pluginId: PluginId = "betterSidebar";

export default function BetterSidebarPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["betterSidebar"];

  const [instantCssServiceActive, setInstantCssServiceActive] = useState(false);

  useEffect(() => {
    InstantCssService.hasPermissions().then(setInstantCssServiceActive);
  }, []);

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["betterSidebar"].enabled = checked;
          });
        }}
      />

      {pluginSettings?.enabled && APP_CONFIG.BROWSER === "chrome" && (
        <RequirePermissionsDialogWrapper
          requiredPermissions={[manifest.manifest.optionalPermissions![0]!]}
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
                ? pluginSettings.shouldPreventLayoutShift
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
