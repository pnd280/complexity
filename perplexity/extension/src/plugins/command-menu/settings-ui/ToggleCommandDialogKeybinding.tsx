import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function ToggleCommandDialogKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const defaultKeys = settings?.plugins["commandMenu"].keybindings.toggle ?? [];

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
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
