import { produce } from 'immer';

import {
  popupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import { ChromeStore } from '@/types/ChromeStore';
import { chromeStorage } from '@/utils/chrome-store';
import { useQuery } from '@tanstack/react-query';

export default function usePopupSettings() {
  const { data: store, refetch } = useQuery({
    queryKey: ['store'],
    queryFn: async () => {
      return await chromeStorage.getStore();
    },
  });

  const handleSettingsChange = async <
    T extends keyof ChromeStore['popupSettings'],
  >(
    section: T,
    key: keyof ChromeStore['popupSettings'][T],
    value: boolean
  ) => {
    if (!store) return;

    await chromeStorage.setStorageValue({
      key: 'popupSettings',
      value: produce(store.popupSettings, (draft) => {
        draft[section] ??= {} as ChromeStore['popupSettings'][T];

        (draft[section][key] as boolean) ??= false;
        (draft[section][key] as boolean) = value;
      }),
    });

    await refetch();

    popupSettingsStore.setState((state) => {
      state[section] ??= {} as ChromeStore['popupSettings'][T];

      (state[section][key] as boolean) ??= false;
      (state[section][key] as boolean) = value;
    });
  };

  return {
    store,
    handleSettingsChange,
  };
}
