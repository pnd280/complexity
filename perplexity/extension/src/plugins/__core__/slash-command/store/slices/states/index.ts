import type { BoundStateCreator } from "@/plugins/__core__/slash-command/store/types";

export type StatesSlice = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const createStatesSlice: BoundStateCreator<StatesSlice> = (set) => ({
  open: false,
  setOpen: (open) => {
    // hacky solution to prevent the popover from briefly stays at 0,0 on open
    setTimeout(() => {
      set({ open });
    }, 10);
  },
});
