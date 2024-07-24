import { produce } from "immer";

import useCPLXUserSettings from "@/shared/hooks/useCPLXUserSettings";
import { ChromeStore } from "@/types/ChromeStore";

export default function usePopupSettings() {
  const {
    data: { data: settings },
    mutation: { mutate: updateSettings },
  } = useCPLXUserSettings();

  const popupSettings = settings?.popupSettings;

  const handleSettingsChange = async <
    T extends keyof ChromeStore["popupSettings"],
  >(
    section: T,
    updater: (draft: ChromeStore["popupSettings"][T]) => void,
  ) => {
    if (!popupSettings) return;

    updateSettings((draft) => {
      draft.popupSettings[section] = produce(
        draft.popupSettings[section],
        updater,
      );
    });
  };

  return {
    settings: popupSettings,
    updateSettings: handleSettingsChange,
  };
}
