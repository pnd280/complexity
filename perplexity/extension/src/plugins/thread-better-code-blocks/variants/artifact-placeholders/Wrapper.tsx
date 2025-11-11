import { ARTIFACT_PLACEHOLDERS } from "@/plugins/thread-artifacts/index.public";
import {
  artifactsStore,
  useArtifactsStore,
} from "@/plugins/thread-artifacts/index.public";
import {
  formatArtifactTitle,
  getArtifactTitle,
  getInterpretedArtifactLanguage,
} from "@/plugins/thread-artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function ArtifactPlaceholderWrapper() {
  const { codeBlock, sourceMessageBlockIndex, sourceCodeBlockIndex } =
    useMirroredCodeBlockContext();

  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const isSelected =
    selectedCodeBlockLocation?.messageBlockIndex === sourceMessageBlockIndex &&
    selectedCodeBlockLocation.codeBlockIndex === sourceCodeBlockIndex;

  const title = formatArtifactTitle(
    getArtifactTitle(codeBlock?.content.language),
  );
  const interpretedLanguage = getInterpretedArtifactLanguage(
    codeBlock?.content.language ?? "",
  );

  if (interpretedLanguage == null) return null;

  const placeholderElements = ARTIFACT_PLACEHOLDERS[interpretedLanguage];

  return (
    <div
      className={cn(
        "x:group x:my-4 x:flex x:w-max x:cursor-pointer x:items-center x:overflow-hidden x:rounded-lg x:border x:border-border/50 x:bg-secondary x:transition-all x:select-none x:hover:border-primary",
        {
          "x:border-primary": isSelected,
        },
      )}
      onClick={() => {
        artifactsStore.setState((draft) => {
          draft.selection.selectedCodeBlockLocation = {
            messageBlockIndex: sourceMessageBlockIndex,
            codeBlockIndex: sourceCodeBlockIndex,
          };
          draft.states.view = "preview";
          draft.ui.isArtifactsListOpen = false;
        });
      }}
    >
      <div
        className={cn(
          "x:flex x:size-16 x:items-center x:justify-center x:group-hover:bg-primary/10",
          {
            "x:bg-primary/10": isSelected,
          },
        )}
      >
        {codeBlock?.states.isInFlight ? (
          <TablerLoaderCircle className="x:size-4 x:animate-spin x:text-muted-foreground" />
        ) : (
          <placeholderElements.icon className="x:size-8" />
        )}
      </div>
      <div className="x:flex x:max-w-[300px] x:flex-col x:border-l x:px-4 x:py-2">
        <div
          className={cn(
            "x:line-clamp-1 x:text-base x:text-foreground x:transition-all x:group-hover:text-primary",
            {
              "x:text-primary": isSelected,
            },
          )}
        >
          {title.length > 0 ? title : placeholderElements.defaultTitle}
        </div>
        <div className="x:w-max x:text-sm x:text-muted-foreground">
          {codeBlock?.states.isInFlight ? (
            <span className="x:animate-pulse">Generating...</span>
          ) : (
            placeholderElements.description
          )}
        </div>
      </div>
    </div>
  );
}
