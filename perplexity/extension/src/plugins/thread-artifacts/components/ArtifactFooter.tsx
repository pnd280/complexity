import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import AutonomousArtifactVersionsNavigator from "@/plugins/thread-artifacts/components/VersionsNavigator";
import { ARTIFACT_LANGUAGE_ACTION_BUTTONS } from "@/plugins/thread-artifacts/consts";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import type { ArtifactLanguage } from "@/plugins/thread-artifacts/types";
import { getInterpretedArtifactLanguage } from "@/plugins/thread-artifacts/utils";

export default function ArtifactFooter() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const language = getInterpretedArtifactLanguage(
    selectedCodeBlock?.content.language ?? "text",
  ) as ArtifactLanguage;

  return (
    <div className="x:sticky x:bottom-0 x:z-10 x:flex x:w-full x:items-center x:justify-between x:border-t x:border-border/50 x:bg-background x:p-2 x:px-4">
      <AutonomousArtifactVersionsNavigator />
      <div className="x:ml-auto x:flex x:items-center x:gap-1">
        {ARTIFACT_LANGUAGE_ACTION_BUTTONS[language] &&
          (() => {
            const ActionButtons = ARTIFACT_LANGUAGE_ACTION_BUTTONS[language];
            return <ActionButtons />;
          })()}
        <Button
          asChild
          className="x:group x:animate-in x:fade-in"
          variant="ghost"
          size="iconSm"
        >
          <CopyButton
            content={selectedCodeBlock?.content.code ?? ""}
            className="x:group-hover:text-primary"
          />
        </Button>
      </div>
    </div>
  );
}
