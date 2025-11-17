import Tooltip from "@/components/Tooltip";
import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { artifactsStore } from "@/plugins/_thread/artifacts/index.public";
import {
  isAutonomousArtifactLanguageString,
  isArtifactLanguageString,
} from "@/plugins/_thread/artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/_thread/better-code-blocks/MirroredCodeBlockContext";

import TablerPlay from "~icons/tabler/play";

export default function ArtifactSimpleModeRenderButton() {
  const { codeBlock, sourceCodeBlockIndex, sourceMessageBlockIndex } =
    useMirroredCodeBlockContext();

  if (!codeBlock) return null;

  const language = codeBlock.content.language;

  if (
    !isArtifactLanguageString(language) &&
    !isAutonomousArtifactLanguageString(language)
  )
    return null;

  return (
    <CsUiGuard desktopOnly dependentPluginIds={["thread:artifacts"]}>
      <Tooltip content="Preview">
        <div
          className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
          onClick={() => {
            artifactsStore.setState((draft) => {
              draft.selection.selectedCodeBlockLocation = {
                messageBlockIndex: sourceMessageBlockIndex,
                codeBlockIndex: sourceCodeBlockIndex,
              };
              draft.states.view = "preview";
            });
          }}
        >
          <TablerPlay className="x:size-4" />
        </div>
      </Tooltip>
    </CsUiGuard>
  );
}
