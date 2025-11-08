import type { ArtifactsStoreType } from "@/plugins/thread-artifacts/store";
import type { SelectionSlice } from "@/plugins/thread-artifacts/store/slices/selection/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/thread-artifacts/store" {
  interface ArtifactsStoreType {
    selection: SelectionSlice;
  }
}

export const createSelectionSlice: SliceCreator<
  SelectionSlice,
  ArtifactsStoreType
> = (set) => ({
  selectedCodeBlockLocation: null,
  setselectedCodeBlockLocation: (location) => {
    set((draft) => {
      draft.selection.selectedCodeBlockLocation = location;
    });
  },

  lastAutoOpenCodeBlockLocation: null,
  setLastAutoOpenCodeBlockLocation: (value) => {
    set((draft) => {
      draft.selection.lastAutoOpenCodeBlockLocation = value;
    });
  },

  close: () => {
    set((draft) => {
      draft.selection.selectedCodeBlockLocation = null;
    });
  },
});
