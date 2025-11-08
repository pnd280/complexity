import type { ArtifactsStoreType } from "@/plugins/thread-artifacts/store";
import type { UISlice } from "@/plugins/thread-artifacts/store/slices/ui/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/thread-artifacts/store" {
  interface ArtifactsStoreType {
    ui: UISlice;
  }
}

export const createUISlice: SliceCreator<UISlice, ArtifactsStoreType> = (
  set,
) => ({
  isArtifactsListOpen: false,

  openArtifactsList: () => {
    set((draft) => {
      draft.ui.isArtifactsListOpen = true;
      draft.selection.selectedCodeBlockLocation = null;
    });
  },

  closeArtifactsList: () => {
    set((draft) => {
      draft.ui.isArtifactsListOpen = false;
    });
  },
});
