import { create } from 'zustand';

import { chromeStorage } from '@/utils/chrome-store';

type GlobalState = {
  isReady: boolean;
  setReady: (isReady: boolean) => void;
  secretMode: boolean;
  customCSS: string;
};

const useGlobalStore = create<GlobalState>((set) => ({
  isReady: false,
  setReady: (isReady: boolean) => set({ isReady }),
  secretMode: false,
  customCSS: '',
}));

const globalStore = useGlobalStore;

(async function initGlobalStore() {
  const secretMode = await chromeStorage.getStorageValue('secretMode');

  globalStore.setState({ secretMode: !!secretMode });

  const customCSS = await chromeStorage.getStorageValue('customCSS');

  globalStore.setState({ customCSS: customCSS || '' });
})();

export { globalStore, useGlobalStore };
