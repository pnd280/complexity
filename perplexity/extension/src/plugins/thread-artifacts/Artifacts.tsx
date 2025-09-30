import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import ArtifactContent from "@/plugins/thread-artifacts/components/ArtifactContent";
import ArtifactFooter from "@/plugins/thread-artifacts/components/ArtifactFooter";
import ArtifactHeader from "@/plugins/thread-artifacts/components/ArtifactHeader";
import ArtifactsList from "@/plugins/thread-artifacts/components/ArtifactsList";
import { normalizeCssResourceConfig } from "@/plugins/thread-artifacts/index.remote-resources";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import { useHandleArtifactsState } from "@/plugins/thread-artifacts/useHandleArtifactsState";
import useHandleAutonomousArtifactsState from "@/plugins/thread-artifacts/useHandleAutonomousArtifactsState";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

const normalizeCss = await getVersionedRemoteResource(
  normalizeCssResourceConfig,
);

export function Artifacts() {
  const threadWrapper = useThreadDomObserverStore(
    (state) => state.$wrapper?.[0],
    deepEqual,
  );

  useHandleArtifactsState();
  useHandleAutonomousArtifactsState();

  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isArtifactOpen = selectedCodeBlockLocation != null;
  const isArtifactsListOpen = useArtifactsStore(
    (state) => state.isArtifactsListOpen,
  );

  useInsertCss({
    id: "artifacts",
    css: normalizeCss,
    inject: isArtifactOpen || isArtifactsListOpen,
  });

  useEffect(() => {
    if (!isArtifactOpen && !isArtifactsListOpen) {
      $(document.body).removeAttr("data-cplx-artifact-active-panel");
      return;
    }

    $(document.body).attr(
      "data-cplx-artifact-active-panel",
      isArtifactsListOpen ? "list" : "artifact",
    );
  }, [isArtifactOpen, isArtifactsListOpen]);

  if (!threadWrapper || (!isArtifactOpen && !isArtifactsListOpen)) return null;

  return (
    <Portal container={threadWrapper}>
      <div
        id="cplx-artifact"
        data-open={isArtifactOpen}
        className={cn(
          "x:fixed x:right-8 x:z-10 x:my-8 x:overflow-hidden x:border x:border-border/50 x:bg-secondary x:text-sm x:transition-all x:animate-in x:fade-in x:slide-in-from-right",
          "x:top-(--header-height) x:xl:sticky x:xl:right-0 x:xl:m-0 x:xl:my-0",
        )}
      >
        {isArtifactsListOpen && <ArtifactsList />}
        {isArtifactOpen && selectedCodeBlock != null && (
          <div className="x:flex x:size-full x:flex-col">
            <ArtifactHeader />
            <ArtifactContent />
            <ArtifactFooter />
          </div>
        )}
      </div>
    </Portal>
  );
}
