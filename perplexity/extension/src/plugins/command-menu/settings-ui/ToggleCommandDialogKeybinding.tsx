import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { useSettings } from "@/plugins/command-menu/settings";

export default function ToggleCommandDialogKeybinding() {
  const { settings, update } = useSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.keybindings.toggle,
    onSave: (keys) => {
      void update({
        updateFn: (draft) => {
          draft.keybindings.toggle = keys;
        },
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
