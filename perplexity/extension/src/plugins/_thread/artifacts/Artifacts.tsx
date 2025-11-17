import { Portal } from "@/components/ui/portal";
import useThreadCodeBlock from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { useInsertCss } from "@/hooks/useInsertCss";
import ArtifactContent from "@/plugins/_thread/artifacts/components/ArtifactContent";
import ArtifactFooter from "@/plugins/_thread/artifacts/components/ArtifactFooter";
import ArtifactHeader from "@/plugins/_thread/artifacts/components/ArtifactHeader";
import ArtifactsList from "@/plugins/_thread/artifacts/components/ArtifactsList";
import { normalizeCssResourceConfig } from "@/plugins/_thread/artifacts/index.remote-resources";
import { useArtifactsStore } from "@/plugins/_thread/artifacts/store";
import { useHandleArtifactsState } from "@/plugins/_thread/artifacts/useHandleArtifactsState";
import useHandleAutonomousArtifactsState from "@/plugins/_thread/artifacts/useHandleAutonomousArtifactsState";

const normalizeCss = await getVersionedRemoteResource(
  normalizeCssResourceConfig,
  persistentQueryClient,
);

export function Artifacts() {
  const root = document.querySelector(DomSelectorsService.Root.cachedSync.ROOT);

  useHandleArtifactsState();
  useHandleAutonomousArtifactsState();

  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isArtifactOpen = selectedCodeBlockLocation != null;
  const isArtifactsListOpen = useArtifactsStore(
    (store) => store.ui.isArtifactsListOpen,
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
    const isSidebarPinned =
      localStorage.getItem("pplx.local-user-settings.isSidebarPinned") ===
      "true";

    if (isArtifactOpen && isSidebarPinned) {
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
