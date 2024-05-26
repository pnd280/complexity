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

  const handleQueryBoxSettingsChange = async (
    key: keyof ChromeStore['popupSettings']['queryBoxSelectors'],
    value: boolean
  ) => {
    if (!store) return;

    if (!store.popupSettings) {
      store.popupSettings = {
        queryBoxSelectors: {
          focus: false,
          languageModel: false,
          imageGenModel: false,
        },
      };
    }

    await chromeStorage.setStorageValue({
      key: 'popupSettings',
      value: produce(store.popupSettings, (draft) => {
        draft.queryBoxSelectors[key] = value;
      }),
    });

    await refetch();
  };

  return {
    store,
    handleQueryBoxSettingsChange,
  };
}
