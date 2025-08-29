import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export default function ToggleSidecarKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const defaultKeys =
    settings?.plugins["commandMenu"].keybindings.toggleSidecar ?? [];

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
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
