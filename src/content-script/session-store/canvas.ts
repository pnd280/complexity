import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type CanvasMetaData = {
  messageBlockIndex: number;
  preBlockIndex: number;
  preBlockId: string;
  content: string;
};

export type CanvasState = {
  isOpen: boolean;
  toggleOpen: (open?: boolean) => void;
  metaData?: CanvasMetaData;
  setMetaData: (metaData?: CanvasMetaData) => void;
  showCode: boolean;
  toggleShowCode: (showCode?: boolean) => void;
};

const useCanvasStore = create<CanvasState>()(
  immer((set, get) => ({
    isOpen: false,
    toggleOpen: (open = !get().isOpen) => set({ isOpen: open }),
    setMetaData: (metaData) => set({ metaData, showCode: false }),
    showCode: false,
    toggleShowCode: (showCode?: boolean) =>
      set({ showCode: showCode ?? !get().showCode }),
  }))
);

const canvasStore = useCanvasStore;

export { canvasStore, useCanvasStore };
