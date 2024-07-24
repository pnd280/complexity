import { create } from "zustand";

type GlobalState = {
  isWebSocketCaptured: boolean;
  isLongPollingCaptured: boolean;
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
  isLongPollingCaptured: false,
}));

const globalStore = useGlobalStore;

export { globalStore, useGlobalStore };
