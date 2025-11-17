import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";

export interface PreviewSlice {
  forceRefreshKey: number;
  refresh: () => void;
  sandpackPreviewRef: SandpackPreviewRef | null;
  setSandpackPreviewRef: (ref: SandpackPreviewRef | null) => void;
}
