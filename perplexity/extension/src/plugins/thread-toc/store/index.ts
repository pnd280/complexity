import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { PanelPosition, TocItem } from "@/plugins/thread-toc/store/types";

type ThreadTocStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tocItems: TocItem[];
  panelPosition: PanelPosition | null;
};

export const threadTocStore = create<ThreadTocStore>()(
  subscribeWithSelector(
    immer(
      (set): ThreadTocStore => ({
        isOpen: false,
        setIsOpen: (isOpen: boolean) => set({ isOpen }),
        tocItems: [],
        panelPosition: null,
      }),
    ),
  ),
);

export const useThreadTocStore = threadTocStore;
