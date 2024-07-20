import { produce } from 'immer';

import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import { ChromeStore } from '@/types/ChromeStore';
import ChromeStorage from '@/utils/ChromeStorage';
import { useQuery } from '@tanstack/react-query';

export default function usePopupSettings() {
  const { data: store, refetch } = useQuery({
    queryKey: ['store'],
    queryFn: async () => {
      return await ChromeStorage.getStore();
    },
  });

  const handleSettingsChange = async <
    T extends keyof ChromeStore['popupSettings'],
    K extends keyof ChromeStore['popupSettings'][T],
  >(
    section: T,
    key: K,
    value: ChromeStore['popupSettings'][T][K]
  ) => {
    if (!store) return;

    await ChromeStorage.setStorageValue({
      key: 'popupSettings',
      value: produce(store.popupSettings, (draft) => {
        draft[section] ??= {} as ChromeStore['popupSettings'][T];

        (draft[section][key] as unknown) ??= null;
        draft[section][key] = value;
      }),
    });

    await refetch();

    popupSettingsStore.setState((state) => {
      state[section] ??= {} as ChromeStore['popupSettings'][T];

      (state[section][key] as unknown) ??= null;
      state[section][key] = value;
    });
  };

  return {
    store,
    handleSettingsChange,
  };
}
