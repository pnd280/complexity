import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function ToggleCommandDialogKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.plugins["commandMenu"].keybindings.toggle,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["commandMenu"].keybindings.toggle = keys;
      });
    },
  });

  return (
    <>
      <div>Activation:</div>
      <HotkeyRecorderUi />
    </>
  );
}
