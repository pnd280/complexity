import { LuPlay } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { artifactsStore } from "@/plugins/thread-artifacts/index.public";
import {
  isAutonomousArtifactLanguageString,
  isArtifactLanguageString,
} from "@/plugins/thread-artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

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
    <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:artifacts"]}>
      <Tooltip content="Preview">
        <div
          className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
          onClick={() => {
            artifactsStore.setState((draft) => {
              draft.selectedCodeBlockLocation = {
                messageBlockIndex: sourceMessageBlockIndex,
                codeBlockIndex: sourceCodeBlockIndex,
              };
              draft.state = "preview";
            });
          }}
        >
          <LuPlay className="x:size-4" />
        </div>
      </Tooltip>
    </CsUiPluginsGuard>
  );
}
