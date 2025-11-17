import type { ArtifactsStoreType } from "@/plugins/_thread/artifacts/store";
import type { BlocksSlice } from "@/plugins/_thread/artifacts/store/slices/blocks/types";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/_thread/artifacts/store" {
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
