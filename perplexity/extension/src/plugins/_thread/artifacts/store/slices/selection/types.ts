import type { CodeBlockLocation } from "@/plugins/_thread/artifacts/store/slices/blocks/types";

export interface SelectionSlice {
  selectedCodeBlockLocation: CodeBlockLocation | null;
  setselectedCodeBlockLocation: (location: CodeBlockLocation) => void;
  lastAutoOpenCodeBlockLocation: CodeBlockLocation | null;
  setLastAutoOpenCodeBlockLocation: (value: CodeBlockLocation | null) => void;
  close: () => void;
}
