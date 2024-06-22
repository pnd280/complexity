import { create } from 'zustand';

import { ChromeStore } from '@/types/ChromeStore';
import { chromeStorage } from '@/utils/chrome-store';

type GlobalState = {
  isWebSocketCaptured: boolean;
  isLongPollingCaptured: boolean;
  secretMode: boolean;
  artifacts: ChromeStore['artifacts'];
  customTheme: ChromeStore['customTheme'];
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
  isLongPollingCaptured: false,
  secretMode: false,
  artifacts: {},
  customTheme: {},
}));

const globalStore = useGlobalStore;

(async function initGlobalStore() {
  const secretMode = await chromeStorage.getStorageValue('secretMode');

  globalStore.setState({ secretMode: !!secretMode });

  const artifacts = await chromeStorage.getStorageValue('artifacts');

  globalStore.setState({ artifacts: artifacts || {} });

  const customTheme = await chromeStorage.getStorageValue('customTheme');

  globalStore.setState({ customTheme: customTheme || {} });
})();

export { globalStore, useGlobalStore };
