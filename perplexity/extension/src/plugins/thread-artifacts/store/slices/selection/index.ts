import type { SelectionSlice } from "@/plugins/thread-artifacts/store/slices/selection/types";
import type { BoundStateCreator } from "@/plugins/thread-artifacts/store/types";

export const createSelectionSlice: BoundStateCreator<SelectionSlice> = (
  set,
) => ({
  selectedCodeBlockLocation: null,
  lastAutoOpenCodeBlockLocation: null,

  setselectedCodeBlockLocation: (location) =>
    set({ selectedCodeBlockLocation: location }),

  setLastAutoOpenCodeBlockLocation: (value) =>
    set({ lastAutoOpenCodeBlockLocation: value }),

  close: () => set({ selectedCodeBlockLocation: null }),
});
