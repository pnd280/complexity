import type { StateCreator } from "zustand";

import type { ArtifactStateSlice } from "@/plugins/thread-artifacts/store/slices/artifact-state/types";
import type { BlocksSlice } from "@/plugins/thread-artifacts/store/slices/blocks/types";
import type { PreviewSlice } from "@/plugins/thread-artifacts/store/slices/preview/types";
import type { SelectionSlice } from "@/plugins/thread-artifacts/store/slices/selection/types";
import type { UISlice } from "@/plugins/thread-artifacts/store/slices/ui/types";

export type ArtifactsStoreType = UISlice &
  BlocksSlice &
  SelectionSlice &
  ArtifactStateSlice &
  PreviewSlice;

export type BoundStateCreator<T> = StateCreator<
  ArtifactsStoreType,
  [["zustand/subscribeWithSelector", never], ["zustand/immer", never]],
  [],
  T
>;
