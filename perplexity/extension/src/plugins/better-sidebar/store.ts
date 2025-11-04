import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type BetterSidebarStoreType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const betterSidebarStore =
  createWithEqualityFn<BetterSidebarStoreType>()(
    subscribeWithSelector(
      immer(
        (set): BetterSidebarStoreType => ({
          open:
            localStorage.getItem("pplx.local-user-settings.isSidebarPinned") ===
            "true",
          setOpen: (open) => set({ open }),
        }),
      ),
    ),
  );

export const useBetterSidebarStore = betterSidebarStore;
