import { useThreadCodeBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/store";

type UseThreadCodeBlockProps = {
  messageBlockIndex?: number;
  codeBlockIndex?: number;
};

export default function useThreadCodeBlock({
  messageBlockIndex,
  codeBlockIndex,
}: UseThreadCodeBlockProps) {
  return useThreadCodeBlocksDomObserverStore((store) => {
    if (messageBlockIndex == null || codeBlockIndex == null) return null;
    return (
      store.codeBlocksChunks?.[messageBlockIndex]?.[codeBlockIndex] ?? null
    );
  }, deepEqual);
}
