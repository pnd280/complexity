import { Tabs, TabContent } from "@/components/ui/tabs";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import ArtifactCodeView from "@/plugins/thread-artifacts/components/ArtifactCodeView";
import ArtifactPreview from "@/plugins/thread-artifacts/components/Preview";
import { ARTIFACT_INITIAL_STATE } from "@/plugins/thread-artifacts/consts";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import { getInterpretedArtifactLanguage } from "@/plugins/thread-artifacts/utils";

export default function ArtifactContent() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const artifactViewMode = useArtifactsStore((state) => state.state);
  const language = getInterpretedArtifactLanguage(
    selectedCodeBlock?.content.language ?? "text",
  );

  const previewKey = useArtifactsStore((state) => state.refreshPreviewKey);
  const isValidArtifactCode = useArtifactsStore(
    (state) => state.isValidArtifactCode,
  );

  if (!isValidArtifactCode || !language) return null;

  return (
    <Tabs
      lazyMount
      value={
        isInFlight && ARTIFACT_INITIAL_STATE[language] === "code"
          ? "code"
          : artifactViewMode
      }
      className={cn("custom-scrollbar", "x:size-full x:overflow-auto")}
    >
      <TabContent value="code" className="x:size-full">
        <ArtifactCodeView />
      </TabContent>
      <TabContent
        value="preview"
        className={cn("x:size-full", {
          "x:hidden":
            isInFlight && ARTIFACT_INITIAL_STATE[language] !== "preview",
        })}
      >
        <ArtifactPreview key={`${previewKey}`} language={language} />
      </TabContent>
    </Tabs>
  );
}
