import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { useSettings } from "@/plugins/command-menu/settings";

export default function ToggleSidecarKeybinding() {
  const { settings, update } = useSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.keybindings.toggleSidecar,
    onSave: (keys) => {
      void update({
        updateFn: (draft) => {
          draft.keybindings.toggleSidecar = keys;
        },
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
