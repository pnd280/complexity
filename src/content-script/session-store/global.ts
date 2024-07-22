import { create } from "zustand";

import { ChromeStore } from "@/types/ChromeStore";
import ChromeStorage from "@/utils/ChromeStorage";
import { extensionExec } from "@/utils/hof";

type GlobalState = {
  isWebSocketCaptured: boolean;
  isLongPollingCaptured: boolean;
  secretMode: boolean;
  customTheme: ChromeStore["customTheme"];
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
  isLongPollingCaptured: false,
  secretMode: false,
  customTheme: {},
}));

const globalStore = useGlobalStore;

extensionExec(async function initGlobalStore() {
  const { customTheme, secretMode } = await ChromeStorage.getStore();

  globalStore.setState({ secretMode });
  globalStore.setState({ customTheme });
})();

export { globalStore, useGlobalStore };
