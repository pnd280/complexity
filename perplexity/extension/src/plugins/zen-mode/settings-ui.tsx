import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "zenMode";

export default function ZenModePluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const defaultKeys = settings?.plugins["zenMode"].hotkey ?? [];

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
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
        checked={settings?.plugins["zenMode"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["zenMode"].enabled = checked;
          });
        }}
      />
      {settings?.plugins["zenMode"].enabled && (
        <>
          <div className="x:hidden x:flex-col x:gap-2 x:md:flex">
            <div>Activation hotkey:</div>
            <HotkeyRecorderUi />
          </div>
          <Switch
            textLabel="Persistent across reloads (remember the last state)"
            checked={settings?.plugins["zenMode"].persistent ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].persistent = checked;
              });
            }}
          />
          <Switch
            textLabel='Always hide "Related" questions section'
            checked={
              settings?.plugins["zenMode"].alwaysHideRelatedQuestions ?? false
            }
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
