import type { ArtifactsStoreType } from "@/plugins/thread-artifacts/store";
import type { BlocksSlice } from "@/plugins/thread-artifacts/store/slices/blocks/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/thread-artifacts/store" {
  interface ArtifactsStoreType {
    blocks: BlocksSlice;
  }
}

export const createBlocksSlice: SliceCreator<
  BlocksSlice,
  ArtifactsStoreType
> = () => ({
  artifactBlocks: {},
});
