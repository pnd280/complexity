import { create } from 'zustand';

import { ChromeStore } from '@/types/ChromeStore';
import { chromeStorage } from '@/utils/chrome-store';

type GlobalState = {
  isWebsocketCaptured: boolean;
  isLongPollingCaptured: boolean;
  secretMode: boolean;
  customTheme: ChromeStore['customTheme'];
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebsocketCaptured: false,
  isLongPollingCaptured: false,
  secretMode: false,
  customTheme: {},
}));

const globalStore = useGlobalStore;

(async function initGlobalStore() {
  const secretMode = await chromeStorage.getStorageValue('secretMode');

  globalStore.setState({ secretMode: !!secretMode });

  const customTheme = await chromeStorage.getStorageValue('customTheme');

  globalStore.setState({ customTheme: customTheme || '' });
})();

export { globalStore, useGlobalStore };
