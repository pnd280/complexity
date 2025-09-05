import { LuList, LuRefreshCcw, LuX } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import PreviewToggle from "@/plugins/artifacts/components/PreviewToggle";
import { artifactsStore, useArtifactsStore } from "@/plugins/artifacts/store";
import type { ArtifactLanguage } from "@/plugins/artifacts/types";
import {
  formatArtifactTitle,
  getArtifactTitle,
  getInterpretedArtifactLanguage,
  isAutonomousArtifactLanguageString,
  isArtifactLanguageString,
} from "@/plugins/artifacts/utils";
import { scrollToElement } from "@/utils/utils";

export default function ArtifactHeader() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
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
  const artifactViewMode = useArtifactsStore((state) => state.state);
  const language = getInterpretedArtifactLanguage(
    selectedCodeBlock?.content.language ?? "text",
  ) as ArtifactLanguage;

  if (!isArtifactLanguage && !isAutonomousArtifactLanguage) return null;

  return (
    <div className="x:flex x:w-full x:items-center x:justify-between x:border-b x:border-border/50 x:bg-background x:p-2 x:px-4">
      <div
        className="x:line-clamp-1 x:cursor-pointer x:text-muted-foreground"
        onClick={() => {
          const selectedCodeBlockLocation =
            artifactsStore.getState().selectedCodeBlockLocation;
          if (!selectedCodeBlockLocation) return;

          const selector = `${getDomSelectorsRootService().cplxAttribute(
            getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE
              .BLOCK,
          )}[data-index="${selectedCodeBlockLocation.messageBlockIndex}"] ${getDomSelectorsRootService().cplxAttribute(
            getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE
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
                onClick={() => artifactsStore.getState().refreshPreview()}
              >
                <LuRefreshCcw className="x:size-4" />
              </Button>
            </Tooltip>
          )}
          {isAutonomousArtifactLanguage && (
            <>
              <PreviewToggle language={language} />
              {isAutonomousArtifactLanguage && (
                <Tooltip content={t("plugin-artifacts.tooltip.openList")}>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() =>
                      artifactsStore.getState().openArtifactsList()
                    }
                  >
                    <LuList className="x:size-4" />
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => artifactsStore.getState().close()}
        >
          <LuX className="x:size-4" />
        </Button>
      </div>
    </div>
  );
}
