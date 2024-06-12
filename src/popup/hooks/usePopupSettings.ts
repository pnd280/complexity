import { produce } from 'immer';

import { ChromeStore } from '@/types/ChromeStore';
import { chromeStorage } from '@/utils/chrome-store';
import { useQuery } from '@tanstack/react-query';

export default function usePopupSettings() {
  const { data: store, refetch } = useQuery({
    queryKey: ['store'],
    queryFn: async () => {
      const store = await chromeStorage.getStore();
      return store;
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
  };

  return {
    store,
    handleSettingsChange,
  };
}
