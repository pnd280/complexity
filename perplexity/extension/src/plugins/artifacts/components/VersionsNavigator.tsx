import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { DomSelectorsService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { artifactsStore, useArtifactsStore } from "@/plugins/artifacts/store";
import { getArtifactTitle } from "@/plugins/artifacts/utils";
import { scrollToElement } from "@/utils/dom-utils/generics";

export default function AutonomousArtifactVersionsNavigator() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const artifactBlocks = useArtifactsStore((state) => state.artifactBlocks);
  const artifactTitle = getArtifactTitle(selectedCodeBlock?.content.language);

  const versions = artifactBlocks[artifactTitle];
  const currentLocationIndex = versions?.location.findIndex(
    (location) =>
      location.messageBlockIndex ===
        selectedCodeBlockLocation?.messageBlockIndex &&
      location.codeBlockIndex === selectedCodeBlockLocation?.codeBlockIndex,
  );
  const hasNextVersion =
    versions?.location &&
    currentLocationIndex !== versions?.location.length - 1;
  const hasPreviousVersion = versions?.location && currentLocationIndex !== 0;

  if (!versions || currentLocationIndex == null) return null;

  return (
    <div
      className={cn("x:flex x:items-center x:gap-1", {
        "x:invisible x:opacity-0": !hasNextVersion && !hasPreviousVersion,
      })}
    >
      <Button
        variant="ghost"
        size="iconSm"
        disabled={!hasPreviousVersion}
        onClick={() => {
          artifactsStore.setState((draft) => {
            if (currentLocationIndex == null) return;
            const newLocation = versions?.location[currentLocationIndex - 1];
            if (!newLocation) return;
            draft.selectedCodeBlockLocation = newLocation;
          });
        }}
      >
        <LuArrowLeft className="x:size-4" />
      </Button>
      <div
        className="x:line-clamp-1 x:cursor-pointer x:text-sm x:text-muted-foreground"
        onClick={() => {
          const selectedCodeBlockLocation =
            artifactsStore.getState().selectedCodeBlockLocation;
          if (!selectedCodeBlockLocation) return;

          const selector = `${DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE.BLOCK,
          )}[data-index="${selectedCodeBlockLocation.messageBlockIndex}"] ${DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE
              .MIRRORED_CODE_BLOCK,
          )}[data-index="${selectedCodeBlockLocation.codeBlockIndex}"]`;

          scrollToElement($(selector), -100);
        }}
      >
        {t("plugin-artifacts.version", {
          number: currentLocationIndex + 1,
        })}
      </div>
      <Button
        variant="ghost"
        size="iconSm"
        disabled={!hasNextVersion}
        onClick={() => {
          artifactsStore.setState((draft) => {
            if (currentLocationIndex == null) return;
            const newLocation = versions?.location[currentLocationIndex + 1];
            if (!newLocation) return;
            draft.selectedCodeBlockLocation = newLocation;
          });
        }}
      >
        <LuArrowRight className="x:size-4" />
      </Button>
    </div>
  );
}
