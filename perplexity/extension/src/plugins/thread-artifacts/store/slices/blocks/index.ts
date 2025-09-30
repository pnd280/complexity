import type { BlocksSlice } from "@/plugins/thread-artifacts/store/slices/blocks/types";
import type { BoundStateCreator } from "@/plugins/thread-artifacts/store/types";

export const createBlocksSlice: BoundStateCreator<BlocksSlice> = () => ({
  artifactBlocks: {},
});
