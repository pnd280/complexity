import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import { createBlocksSlice } from "@/plugins/thread-artifacts/store/slices/blocks";
import { createPreviewSlice } from "@/plugins/thread-artifacts/store/slices/preview";
import { createSelectionSlice } from "@/plugins/thread-artifacts/store/slices/selection";
import { createArtifactStateSlice } from "@/plugins/thread-artifacts/store/slices/states";
import { createUISlice } from "@/plugins/thread-artifacts/store/slices/ui";

export type {
  CodeBlockLocation,
  ArtifactBlock,
} from "@/plugins/thread-artifacts/store/slices/blocks/types";

export interface ArtifactsStoreType {}

export const artifactsStore = createWithEqualityFn<ArtifactsStoreType>()(
  subscribeWithSelector(
    mutative((set, get, ...props) => ({
      ui: createUISlice(set, get, ...props),
      blocks: createBlocksSlice(set, get, ...props),
      selection: createSelectionSlice(set, get, ...props),
      states: createArtifactStateSlice(set, get, ...props),
      preview: createPreviewSlice(set, get, ...props),
    })),
  ),
);

export const useArtifactsStore = artifactsStore;
