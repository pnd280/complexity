import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type CanvasMetaData = {
  messageBlockIndex: number;
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

const useCanvasStore = createWithEqualityFn<CanvasState>()(
  immer(
    (set, get): CanvasState => ({
      isOpen: false,
      toggleOpen: (open = !get().isOpen) => set({ isOpen: open }),
      setMetaData: (metaData) => set({ metaData, showCode: false }),
      showCode: false,
      toggleShowCode: (showCode?: boolean) =>
        set({ showCode: showCode ?? !get().showCode }),
    }),
  ),
);

const canvasStore = useCanvasStore;

export { canvasStore, useCanvasStore };
