import type { PluginId } from "@/__registries__/plugins/meta.types";
import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "zenMode";

export default function ZenModePluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.plugins["zenMode"].hotkey,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["zenMode"].hotkey = keys;
      });
    },
  });

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.plugins["zenMode"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["zenMode"].enabled = checked;
          });
        }}
      />
      {settings.plugins["zenMode"].enabled && (
        <>
          <div className="x:hidden x:flex-col x:gap-2 x:md:flex">
            <div>Activation hotkey:</div>
            <HotkeyRecorderUi />
          </div>
          <Switch
            textLabel="Persistent across reloads (remember the last state)"
            checked={settings.plugins["zenMode"].persistent}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].persistent = checked;
              });
            }}
          />
          <Switch
            textLabel='Always hide "Related" questions section'
            checked={settings.plugins["zenMode"].alwaysHideRelatedQuestions}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].alwaysHideRelatedQuestions = checked;
              });
            }}
          />
        </>
      )}
    </div>
  );
}
