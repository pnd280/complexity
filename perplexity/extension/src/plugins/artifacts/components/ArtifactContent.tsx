import { Tabs, TabContent } from "@/components/ui/tabs";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import ArtifactCodeView from "@/plugins/artifacts/components/ArtifactCodeView";
import ArtifactPreview from "@/plugins/artifacts/components/Preview";
import { ARTIFACT_INITIAL_STATE } from "@/plugins/artifacts/consts";
import { useArtifactsStore } from "@/plugins/artifacts/store";
import type { ArtifactLanguage } from "@/plugins/artifacts/types";
import { getInterpretedArtifactLanguage } from "@/plugins/artifacts/utils";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

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
  ) as ArtifactLanguage;
  const previewKey = useArtifactsStore((state) => state.refreshPreviewKey);
  const isValidArtifactCode = useArtifactsStore(
    (state) => state.isValidArtifactCode,
  );

  if (!isValidArtifactCode) return null;

  return (
    <Tabs
      lazyMount
      value={
        isInFlight && ARTIFACT_INITIAL_STATE[language] === "code"
          ? "code"
          : artifactViewMode
      }
      className={cn(PPLX_SCROLLBAR_CLASSES, "x:size-full x:overflow-auto")}
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
