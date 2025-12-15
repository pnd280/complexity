import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { useSettings } from "@/plugins/command-menu/settings";

export default function ThreadsSearchPageKeybinding() {
  const { settings, update } = useSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.keybindings.threadsSearch,
    onSave: (keys) => {
      void update({
        updateFn: (draft) => {
          draft.keybindings.threadsSearch = keys;
        },
      });
    },
  });

  return (
    <>
      <div>Threads search:</div>
      <HotkeyRecorderUi />
    </>
  );
}
