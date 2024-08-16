import { create } from "zustand";

type GlobalState = {
  isWebSocketCaptured: boolean;
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
}));

const globalStore = useGlobalStore;

export { globalStore, useGlobalStore };
