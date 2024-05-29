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

    await chromeStorage.setStorageValue({
      key: 'popupSettings',
      value: produce(store.popupSettings, (draft) => {
        draft.queryBoxSelectors ??= {} as ChromeStore['popupSettings']['queryBoxSelectors'];
        draft.queryBoxSelectors[key] ??= false;
        draft.queryBoxSelectors[key] = value;
      }),
    });

    await refetch();
  };

  const handleQolTweaksChange = async (
    key: keyof ChromeStore['popupSettings']['qolTweaks'],
    value: boolean
  ) => {
    if (!store) return;

    await chromeStorage.setStorageValue({
      key: 'popupSettings',
      value: produce(store.popupSettings, (draft) => {
        draft.qolTweaks ??= {} as ChromeStore['popupSettings']['qolTweaks'];
        draft.qolTweaks[key] ??= false;
        draft.qolTweaks[key] = value;
      }),
    });

    await refetch();
  };

  const handleVisualTweaksChange = async (
    key: keyof ChromeStore['popupSettings']['visualTweaks'],
    value: boolean
  ) => {
    if (!store) return;

    await chromeStorage.setStorageValue({
      key: 'popupSettings',
      value: produce(store.popupSettings, (draft) => {
        draft.visualTweaks ??= {} as ChromeStore['popupSettings']['visualTweaks'];
        draft.visualTweaks[key] ??= false;
        draft.visualTweaks[key] = value;
      }),
    });

    await refetch();
  }

  return {
    store,
    handleQueryBoxSettingsChange,
    handleQolTweaksChange,
    handleVisualTweaksChange,
  };
}
