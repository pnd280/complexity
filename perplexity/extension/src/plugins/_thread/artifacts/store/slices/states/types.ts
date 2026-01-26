import type { ArtifactView } from "@/plugins/_thread/artifacts/types";

export interface ArtifactStateSlice {
  isValidArtifactCode: boolean;
  view: ArtifactView;
  setView: (state: ArtifactView) => void;
  hasAutoPreviewTriggered: boolean;
  setHasAutoPreviewTriggered: (value: boolean) => void;
}
