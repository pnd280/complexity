import { create } from "zustand";

type GlobalState = {
  isWebSocketCaptured: boolean;
  internalWebSocketInitialized: boolean;
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
  internalWebSocketInitialized: false,
}));

const globalStore = useGlobalStore;

export { globalStore, useGlobalStore };
