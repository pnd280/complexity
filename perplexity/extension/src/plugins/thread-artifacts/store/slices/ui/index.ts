import type { UISlice } from "@/plugins/thread-artifacts/store/slices/ui/types";
import type { BoundStateCreator } from "@/plugins/thread-artifacts/store/types";

export const createUISlice: BoundStateCreator<UISlice> = (set) => ({
  isArtifactsListOpen: false,

  openArtifactsList: () => {
    set({ isArtifactsListOpen: true, selectedCodeBlockLocation: null });
  },

  closeArtifactsList: () => set({ isArtifactsListOpen: false }),
});
