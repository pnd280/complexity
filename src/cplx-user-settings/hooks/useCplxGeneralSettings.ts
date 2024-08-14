import { produce } from "immer";

import { CplxUserSettings } from "@/cplx-user-settings/types/cplx-user-settings.types";
import useCplxUserSettings from "@/shared/hooks/useCplxUserSettings";

export default function useCplxGeneralSettings() {
  const {
    data: { data: settings },
    mutation: { mutate: updateSettings },
  } = useCplxUserSettings();

  const generalSettings = settings?.generalSettings;

  const handleSettingsChange = async <
    T extends keyof CplxUserSettings["generalSettings"],
  >(
    section: T,
    updater: (draft: CplxUserSettings["generalSettings"][T]) => void,
  ) => {
    if (!generalSettings) return;

    updateSettings((draft) => {
      draft.generalSettings[section] = produce(
        draft.generalSettings[section],
        updater,
      );
    });
  };

  return {
    settings: generalSettings,
    updateSettings: handleSettingsChange,
  };
}
