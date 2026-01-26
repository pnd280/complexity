import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { useSettings } from "@/plugins/command-menu/settings";

export default function SpacesSearchPageKeybinding() {
  const { settings, update } = useSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.keybindings.spacesSearch,
    onSave: (keys) => {
      void update({
        updateFn: (draft) => {
          draft.keybindings.spacesSearch = keys;
        },
      });
    },
  });

  return (
    <>
      <div>Spaces search:</div>
      <HotkeyRecorderUi />
    </>
  );
}
