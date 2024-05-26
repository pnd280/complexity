import { create } from 'zustand';

type GlobalState = {
  isReady: boolean;
  setReady: (isReady: boolean) => void;
};

const useGlobalStore = create<GlobalState>((set) => ({
  isReady: false,
  setReady: (isReady: boolean) => set({ isReady }),
}));

const globalStore = useGlobalStore;

export { globalStore, useGlobalStore };
