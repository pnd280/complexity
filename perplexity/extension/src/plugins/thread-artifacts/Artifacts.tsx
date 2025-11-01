import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import ArtifactContent from "@/plugins/thread-artifacts/components/ArtifactContent";
import ArtifactFooter from "@/plugins/thread-artifacts/components/ArtifactFooter";
import ArtifactHeader from "@/plugins/thread-artifacts/components/ArtifactHeader";
import ArtifactsList from "@/plugins/thread-artifacts/components/ArtifactsList";
import { normalizeCssResourceConfig } from "@/plugins/thread-artifacts/index.remote-resources";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import { useHandleArtifactsState } from "@/plugins/thread-artifacts/useHandleArtifactsState";
import useHandleAutonomousArtifactsState from "@/plugins/thread-artifacts/useHandleAutonomousArtifactsState";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { getCookie } from "@/utils/dom-utils/generics";

const normalizeCss = await getVersionedRemoteResource(
  normalizeCssResourceConfig,
  persistentQueryClient,
);

export function Artifacts() {
  const root = document.querySelector(DomSelectorsService.Root.cachedSync.ROOT);

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

  useEffect(() => {
    if (isArtifactOpen && getCookie("isSidebarPinned") === "true") {
      const $pinSidebarButton = $(
        DomSelectorsService.Root.cachedSync.SIDEBAR.PIN_SIDEBAR_BUTTON,
      );

      if (!$pinSidebarButton.length) return;

      $pinSidebarButton.trigger("click");
    }
  }, [isArtifactOpen]);

  if (
    !root ||
    !(root instanceof HTMLElement) ||
    (!isArtifactOpen && !isArtifactsListOpen)
  )
    return null;

  return (
    <Portal container={root}>
      <div id="cplx-artifact" data-open={isArtifactOpen}>
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
