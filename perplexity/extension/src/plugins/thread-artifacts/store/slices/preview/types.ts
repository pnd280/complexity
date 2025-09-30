import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";

export interface PreviewSlice {
  refreshPreviewKey: number;
  refreshPreview: () => void;
  sandpackPreviewRef: SandpackPreviewRef | null;
  setSandpackPreviewRef: (ref: SandpackPreviewRef | null) => void;
}
