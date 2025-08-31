import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function SpacesSearchPageKeybinding() {
  const { settings, mutation } = useExtensionSettings();

  const defaultKeys =
    settings?.plugins["commandMenu"].keybindings.spacesSearch ?? [];

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
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
