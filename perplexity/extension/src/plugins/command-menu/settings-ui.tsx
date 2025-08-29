import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import SpacesSearchPageKeybinding from "@/plugins/command-menu/settings-ui/SpacesSearchPageKeybinding";
import ThreadsSearchPageKeybinding from "@/plugins/command-menu/settings-ui/ThreadsSearchPageKeybinding";
import ToggleCommandDialogKeybinding from "@/plugins/command-menu/settings-ui/ToggleCommandDialogKeybinding";
import ToggleSidecarKeybinding from "@/plugins/command-menu/settings-ui/ToggleSidecarKeybinding";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "commandMenu";

export default function CommandMenuPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["commandMenu"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["commandMenu"].enabled = checked;
          });
        }}
      />
      {settings?.plugins["commandMenu"].enabled && (
        <div className="x:grid x:grid-cols-[auto_1fr] x:gap-4">
          <ToggleCommandDialogKeybinding />
          <ThreadsSearchPageKeybinding />
          <SpacesSearchPageKeybinding />
          <ToggleSidecarKeybinding />
        </div>
      )}
      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/m8x0hm1.png"
          alt="command-menu"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
