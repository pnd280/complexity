import MarkdownRendererComponent from "@/components/MarkdownRenderer";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";

export default function MarkdownRenderer() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code;

  return (
    <div className="x:mx-auto x:prose x:p-4 x:py-8 x:dark:prose-invert">
      <MarkdownRendererComponent markdown={code ?? ""} />
    </div>
  );
}
