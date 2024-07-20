import { create } from 'zustand';

import { ChromeStore } from '@/types/ChromeStore';
import ChromeStorage from '@/utils/ChromeStorage';
import { extensionExec } from '@/utils/hoc';

type GlobalState = {
  isWebSocketCaptured: boolean;
  isLongPollingCaptured: boolean;
  secretMode: boolean;
  customTheme: ChromeStore['customTheme'];
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
  isLongPollingCaptured: false,
  secretMode: false,
  customTheme: {},
}));

const globalStore = useGlobalStore;

extensionExec(async function initGlobalStore() {
  const secretMode = await ChromeStorage.getStorageValue('secretMode');

  globalStore.setState({ secretMode: !!secretMode });

  const customTheme = await ChromeStorage.getStorageValue('customTheme');

  globalStore.setState({ customTheme: customTheme || {} });
})();

export { globalStore, useGlobalStore };
