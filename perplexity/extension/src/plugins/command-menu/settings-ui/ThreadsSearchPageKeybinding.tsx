import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function ThreadsSearchPageKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.plugins["commandMenu"].keybindings.threadsSearch,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["commandMenu"].keybindings.threadsSearch = keys;
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
