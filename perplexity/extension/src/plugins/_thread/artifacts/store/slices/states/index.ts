import type { ArtifactsStoreType } from "@/plugins/_thread/artifacts/store";
import type { ArtifactStateSlice } from "@/plugins/_thread/artifacts/store/slices/states/types";
import type { ArtifactView } from "@/plugins/_thread/artifacts/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/_thread/artifacts/store" {
  interface ArtifactsStoreType {
    states: ArtifactStateSlice;
  }
}

export const createArtifactStateSlice: SliceCreator<
  ArtifactStateSlice,
  ArtifactsStoreType
> = (set) => ({
  isValidArtifactCode: false,

  view: "code" as ArtifactView,
  setView: (state) => {
    set((draft) => {
      draft.states.view = state;
    });
  },

  hasAutoPreviewTriggered: false,
  setHasAutoPreviewTriggered: (value) => {
    set((draft) => {
      draft.states.hasAutoPreviewTriggered = value;
    });
  },
});
