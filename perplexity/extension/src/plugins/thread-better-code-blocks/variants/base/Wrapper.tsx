import { PluginsStatesService } from "@/plugins/__async-deps__/plugins-states";
import { useArtifactsStore } from "@/plugins/thread-artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import BetterCodeBlockHeader from "@/plugins/thread-better-code-blocks/variants/base/Header";
import HighlightedCodeWrapper from "@/plugins/thread-better-code-blocks/variants/HighlightedCode";

export default function BaseCodeBlockWrapper() {
  const { maxHeight, maxWidth, sourceMessageBlockIndex, sourceCodeBlockIndex } =
    useMirroredCodeBlockContext();

  const isArtifactEnabled =
    PluginsStatesService.cachedEnableStates?.["thread:artifacts"];
  const selectedArtifactCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );
  const isSelectedArtifactCodeBlock =
    selectedArtifactCodeBlockLocation?.messageBlockIndex ===
      sourceMessageBlockIndex &&
    selectedArtifactCodeBlockLocation.codeBlockIndex === sourceCodeBlockIndex;

  return (
    <div
      className={cn(
        "x:relative x:my-4 x:flex x:flex-col x:rounded-lg x:border x:border-border/50 x:bg-secondary x:font-mono x:transition-all",
        {
          "x:overflow-hidden": maxHeight === 0,
          "x:w-(--max-width-percentage)": maxWidth > 0,
          "x:border-primary": isArtifactEnabled && isSelectedArtifactCodeBlock,
        },
      )}
      style={{
        maxWidth: maxWidth > 0 ? `${maxWidth}%` : undefined,
      }}
    >
      <BetterCodeBlockHeader />
      <HighlightedCodeWrapper />
    </div>
  );
}
