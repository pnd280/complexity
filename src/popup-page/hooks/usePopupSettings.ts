import { produce } from "immer";

import useCplxUserSettings from "@/shared/hooks/useCplxUserSettings";
import { CplxUserSettings } from "@/types/cplx-user-settings.types";

export default function usePopupSettings() {
  const {
    data: { data: settings },
    mutation: { mutate: updateSettings },
  } = useCplxUserSettings();

  const popupSettings = settings?.popupSettings;

  const handleSettingsChange = async <
    T extends keyof CplxUserSettings["popupSettings"],
  >(
    section: T,
    updater: (draft: CplxUserSettings["popupSettings"][T]) => void,
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
