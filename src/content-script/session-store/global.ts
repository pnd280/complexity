import { create } from "zustand";

type GlobalState = {
  isWebSocketCaptured: boolean;
  isLoggedIn: boolean;
};

const useGlobalStore = create<GlobalState>(() => ({
  isWebSocketCaptured: false,
  isLoggedIn: false,
}));

const globalStore = useGlobalStore;

export { globalStore, useGlobalStore };
