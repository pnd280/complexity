import type { ArtifactState } from "@/plugins/thread-artifacts/types";

export interface ArtifactStateSlice {
  state: ArtifactState;
  setState: (state: ArtifactState) => void;
  isValidArtifactCode: boolean;
  hasAutoPreviewTriggered: boolean;
  setHasAutoPreviewTriggered: (value: boolean) => void;
}
