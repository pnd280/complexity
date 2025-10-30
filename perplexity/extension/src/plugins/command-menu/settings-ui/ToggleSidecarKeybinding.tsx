import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function ToggleSidecarKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.plugins["commandMenu"].keybindings.toggleSidecar,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["commandMenu"].keybindings.toggleSidecar = keys;
      });
    },
  });

  return (
    <>
      <div>Toggle item previews:</div>
      <HotkeyRecorderUi />
    </>
  );
}
