import type { ArtifactStateSlice } from "@/plugins/thread-artifacts/store/slices/artifact-state/types";
import type { BoundStateCreator } from "@/plugins/thread-artifacts/store/types";
import type { ArtifactState } from "@/plugins/thread-artifacts/types";

export const createArtifactStateSlice: BoundStateCreator<ArtifactStateSlice> = (
  set,
) => ({
  state: "code" as ArtifactState,
  isValidArtifactCode: false,
  hasAutoPreviewTriggered: false,

  setState: (state) => set({ state }),

  setHasAutoPreviewTriggered: (value) =>
    set({ hasAutoPreviewTriggered: value }),
});
