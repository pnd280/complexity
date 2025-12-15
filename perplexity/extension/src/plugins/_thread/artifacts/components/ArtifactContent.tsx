import { Tabs, TabContent } from "@/components/ui/tabs";
import useThreadCodeBlock from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import ArtifactCodeView from "@/plugins/_thread/artifacts/components/ArtifactCodeView";
import ArtifactPreview from "@/plugins/_thread/artifacts/components/Preview";
import { ARTIFACT_INITIAL_STATE } from "@/plugins/_thread/artifacts/consts";
import { useArtifactsStore } from "@/plugins/_thread/artifacts/store";
import { getInterpretedArtifactLanguage } from "@/plugins/_thread/artifacts/utils";

export default function ArtifactContent() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const artifactViewMode = useArtifactsStore((store) => store.states.view);
  const language = getInterpretedArtifactLanguage(
    selectedCodeBlock?.content.language ?? "text",
  );

  const previewKey = useArtifactsStore(
    (store) => store.preview.forceRefreshKey,
  );
  const isValidArtifactCode = useArtifactsStore(
    (store) => store.states.isValidArtifactCode,
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
