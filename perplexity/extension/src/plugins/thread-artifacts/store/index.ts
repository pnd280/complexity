import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { createArtifactStateSlice } from "@/plugins/thread-artifacts/store/slices/artifact-state";
import { createBlocksSlice } from "@/plugins/thread-artifacts/store/slices/blocks";
import { createPreviewSlice } from "@/plugins/thread-artifacts/store/slices/preview";
import { createSelectionSlice } from "@/plugins/thread-artifacts/store/slices/selection";
import { createUISlice } from "@/plugins/thread-artifacts/store/slices/ui";
import type { ArtifactsStoreType } from "@/plugins/thread-artifacts/store/types";

export type {
  CodeBlockLocation,
  ArtifactBlock,
} from "@/plugins/thread-artifacts/store/slices/blocks/types";

export const artifactsStore = createWithEqualityFn<ArtifactsStoreType>()(
  subscribeWithSelector(
    immer((set, get, ...props) => ({
      ...createUISlice(set, get, ...props),
      ...createBlocksSlice(set, get, ...props),
      ...createSelectionSlice(set, get, ...props),
      ...createArtifactStateSlice(set, get, ...props),
      ...createPreviewSlice(set, get, ...props),
    })),
  ),
);

export const useArtifactsStore = artifactsStore;
