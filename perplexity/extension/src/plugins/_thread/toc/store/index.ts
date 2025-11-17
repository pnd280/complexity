import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { mutative } from "zustand-mutative";

import type { PanelPosition, TocItem } from "@/plugins/_thread/toc/store/types";

type ThreadTocStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tocItems: TocItem[];
  panelPosition: PanelPosition | null;
};

export const threadTocStore = create<ThreadTocStore>()(
  subscribeWithSelector(
    mutative(
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
