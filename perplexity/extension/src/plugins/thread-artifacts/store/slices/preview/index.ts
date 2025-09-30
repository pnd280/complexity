import type { PreviewSlice } from "@/plugins/thread-artifacts/store/slices/preview/types";
import type { BoundStateCreator } from "@/plugins/thread-artifacts/store/types";

export const createPreviewSlice: BoundStateCreator<PreviewSlice> = (set) => ({
  refreshPreviewKey: 0,
  sandpackPreviewRef: null,

  refreshPreview: () =>
    set((state) => ({ refreshPreviewKey: state.refreshPreviewKey + 1 })),

  setSandpackPreviewRef: (ref) => set({ sandpackPreviewRef: ref }),
});
