import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function ThreadsSearchPageKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const defaultKeys =
    settings?.plugins["commandMenu"].keybindings.threadsSearch ?? [];

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
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
