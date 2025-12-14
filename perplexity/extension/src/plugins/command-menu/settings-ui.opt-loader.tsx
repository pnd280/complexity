import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/command-menu/settings";
import SpacesSearchPageKeybinding from "@/plugins/command-menu/settings-ui/SpacesSearchPageKeybinding";
import ThreadsSearchPageKeybinding from "@/plugins/command-menu/settings-ui/ThreadsSearchPageKeybinding";
import ToggleCommandDialogKeybinding from "@/plugins/command-menu/settings-ui/ToggleCommandDialogKeybinding";
import ToggleSidecarKeybinding from "@/plugins/command-menu/settings-ui/ToggleSidecarKeybinding";

function CommandMenuPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn(prev) {
              prev.enabled = checked;
            },
          });
        }}
      />
      {settings.enabled && (
        <div className="x:grid x:grid-cols-[auto_1fr] x:gap-4">
          <ToggleCommandDialogKeybinding />
          <ThreadsSearchPageKeybinding />
          <SpacesSearchPageKeybinding />
          <ToggleSidecarKeybinding />
        </div>
      )}
      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://cdn.cplx.app/images/m8x0hm1.png"
          alt="command-menu"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "commandMenu",
    ui: <CommandMenuPluginSettingsUi />,
  });
}
