import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import PreviewToggle from "@/plugins/thread-artifacts/components/PreviewToggle";
import {
  artifactsStore,
  useArtifactsStore,
} from "@/plugins/thread-artifacts/store";
import type { ArtifactLanguage } from "@/plugins/thread-artifacts/types";
import {
  formatArtifactTitle,
  getArtifactTitle,
  getInterpretedArtifactLanguage,
  isAutonomousArtifactLanguageString,
  isArtifactLanguageString,
} from "@/plugins/thread-artifacts/utils";
import { scrollToElement } from "@/utils/dom-utils/generics";

import TablerList from "~icons/tabler/list";
import TablerRefresh from "~icons/tabler/refresh";
import TablerX from "~icons/tabler/x";

export default function ArtifactHeader() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const title = formatArtifactTitle(
    getArtifactTitle(selectedCodeBlock?.content.language),
  );
  const isArtifactLanguage = isArtifactLanguageString(
    selectedCodeBlock?.content.language,
  );
  const isAutonomousArtifactLanguage = isAutonomousArtifactLanguageString(
    selectedCodeBlock?.content.language,
  );
  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const artifactViewMode = useArtifactsStore((store) => store.states.view);
  const language = getInterpretedArtifactLanguage(
    selectedCodeBlock?.content.language ?? "text",
  ) as ArtifactLanguage;

  if (!isArtifactLanguage && !isAutonomousArtifactLanguage) return null;

  return (
    <div className="x:sticky x:top-0 x:z-10 x:flex x:w-full x:items-center x:justify-between x:border-b x:border-border/50 x:bg-background x:p-2 x:px-4">
      <div
        className="x:line-clamp-1 x:cursor-pointer x:text-muted-foreground"
        onClick={() => {
          const selectedCodeBlockLocation =
            artifactsStore.getState().selection.selectedCodeBlockLocation;
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
        {title}
      </div>
      <div className="x:flex x:items-center x:gap-1">
        <div
          className={cn("x:flex x:items-center x:gap-1", {
            "x:invisible": isInFlight,
          })}
        >
          {artifactViewMode === "preview" && (
            <Tooltip content={t("plugin-artifacts.tooltip.refresh")}>
              <Button
                variant="ghost"
                size="iconSm"
                className="x:animate-in x:fade-in"
                onClick={() => artifactsStore.getState().preview.refresh()}
              >
                <TablerRefresh className="x:size-4" />
              </Button>
            </Tooltip>
          )}
          {isAutonomousArtifactLanguage && (
            <>
              <PreviewToggle language={language} />
              <Tooltip content={t("plugin-artifacts.tooltip.openList")}>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() =>
                    artifactsStore.getState().ui.openArtifactsList()
                  }
                >
                  <TablerList className="x:size-4" />
                </Button>
              </Tooltip>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => artifactsStore.getState().selection.close()}
        >
          <TablerX className="x:size-4" />
        </Button>
      </div>
    </div>
  );
}
