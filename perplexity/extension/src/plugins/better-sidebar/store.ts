import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

export type BetterSidebarStoreType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const betterSidebarStore =
  createWithEqualityFn<BetterSidebarStoreType>()(
    subscribeWithSelector(
      mutative(
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
