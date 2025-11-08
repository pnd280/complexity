import type { ArtifactsStoreType } from "@/plugins/thread-artifacts/store";
import type { PreviewSlice } from "@/plugins/thread-artifacts/store/slices/preview/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/thread-artifacts/store" {
  interface ArtifactsStoreType {
    preview: PreviewSlice;
  }
}

export const createPreviewSlice: SliceCreator<
  PreviewSlice,
  ArtifactsStoreType
> = (set) => ({
  forceRefreshKey: 0,
  refresh: () => {
    set(
      (draft) =>
        (draft.preview.forceRefreshKey = draft.preview.forceRefreshKey + 1),
    );
  },

  sandpackPreviewRef: null,
  setSandpackPreviewRef: (ref) => {
    set((draft) => {
      draft.preview.sandpackPreviewRef = ref;
    });
  },
});
