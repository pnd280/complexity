import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function SpacesSearchPageKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.plugins["commandMenu"].keybindings.spacesSearch,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["commandMenu"].keybindings.spacesSearch = keys;
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
