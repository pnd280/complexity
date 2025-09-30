import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { useColorSchemeStore } from "@/plugins/__async-deps__/global-stores/color-scheme-store";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { getActiveQueryBoxTextbox } from "@/plugins/__ui-groups__/elements/query-box/utils";
import { MermaidRendererService } from "@/plugins/thread-artifacts/mermaid-renderer/service/service-init";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import {
  formatArtifactTitle,
  getArtifactTitle,
  isAutonomousArtifactLanguageString,
} from "@/plugins/thread-artifacts/utils";

export default function MermaidRenderer() {
  const { colorScheme } = useColorSchemeStore();

  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isAutonomousArtifact = isAutonomousArtifactLanguageString(
    selectedCodeBlock?.content.language,
  );
  const title = formatArtifactTitle(
    getArtifactTitle(selectedCodeBlock?.content.language),
  );

  const code = selectedCodeBlock?.content.code;
  const isInFlight = selectedCodeBlock?.states.isInFlight;

  const [refreshKey, refreshContainer] = useReducer((state) => state + 1, 0);

  const {
    mutate,
    isPending,
    isSuccess: mermaidRendererResponded,
    data: result,
  } = useMutation({
    mutationFn: async () => {
      return await MermaidRendererService.Instance.render(
        `#artifact-mermaid-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`,
      );
    },
  });

  const isSuccess = result?.success;

  useEffect(() => {
    if (isInFlight) return;

    refreshContainer();
    setTimeout(() => {
      mutate();
    }, 0);
  }, [mutate, code, colorScheme, isInFlight]);

  return (
    <div key={refreshKey} className="x:relative x:size-full">
      {!isPending &&
        mermaidRendererResponded &&
        !isSuccess &&
        !result?.error && (
          <div className="x:absolute x:inset-1/2 x:w-max x:-translate-x-1/2 x:-translate-y-1/2">
            <span className="x:animate-in x:fade-in">
              Failed to render provided mermaid code. Try to reload the
              Artifact.
            </span>
          </div>
        )}
      {!isPending &&
        mermaidRendererResponded &&
        !isSuccess &&
        result?.error && (
          <div className="x:flex x:flex-col x:gap-4 x:p-4 x:font-mono">
            <div className="x:text-lg x:font-bold x:text-destructive">
              An error occurred while rendering:
            </div>
            <div className="x:whitespace-pre x:animate-in x:fade-in">
              {result.error}
            </div>
            <Button
              className="x:w-max"
              variant="destructive"
              onClick={() => {
                const $queryBoxTextbox = getActiveQueryBoxTextbox();
                if (!$queryBoxTextbox.length) return;

                const errorText = `${isAutonomousArtifact && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${result.error}`;

                $queryBoxTextbox.trigger("focus");
                document.execCommand("insertText", false, errorText);
              }}
            >
              Fix Error
            </Button>
          </div>
        )}
      <div
        id={`artifact-mermaid-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`}
        className={cn("x:size-full x:text-secondary x:transition-opacity", {
          "x:opacity-0": !mermaidRendererResponded || !isSuccess,
        })}
      >
        {code}
      </div>
      {(isPending || isSuccess == null) && (
        <div className="x:absolute x:inset-1/2 x:-translate-x-1/2 x:-translate-y-1/2 x:animate-in x:fade-in">
          <LuLoaderCircle className="x:size-10 x:animate-spin x:text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
