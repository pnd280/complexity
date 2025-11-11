import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadCodeBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/code-blocks/store";
import { ARTIFACT_INITIAL_STATE } from "@/plugins/thread-artifacts/consts";
import {
  artifactsStore,
  useArtifactsStore,
} from "@/plugins/thread-artifacts/store";
import type { ArtifactLanguage } from "@/plugins/thread-artifacts/types";
import {
  getInterpretedArtifactLanguage,
  isAutonomousArtifactLanguageString,
} from "@/plugins/thread-artifacts/utils";

export default function useHandleAutonomousArtifactsState() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isArtifactOpen = selectedCodeBlockLocation != null;
  const hasAutoPreviewTriggered = useArtifactsStore(
    (store) => store.states.hasAutoPreviewTriggered,
  );
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  useEffect(
    function handleInFlightCodeBlocks() {
      if (!codeBlocksChunks) return;

      messageBlockLoop: for (
        let chunkIndex = codeBlocksChunks.length - 1;
        chunkIndex >= 0;
        chunkIndex -= 1
      ) {
        const messageBlock = codeBlocksChunks[chunkIndex];

        if (!messageBlock) continue;

        for (
          let codeIndex = messageBlock.length - 1;
          codeIndex >= 0;
          codeIndex -= 1
        ) {
          const codeBlock = messageBlock[codeIndex];

          if (!codeBlock) continue;

          if (
            !codeBlock.content.language ||
            !isAutonomousArtifactLanguageString(codeBlock.content.language)
          )
            continue;

          const isCurrentlySelected =
            chunkIndex === selectedCodeBlockLocation?.messageBlockIndex &&
            codeIndex === selectedCodeBlockLocation.codeBlockIndex;

          if (!codeBlock.states.isInFlight || isCurrentlySelected) continue;

          const lastAutoOpenCodeBlockLocation =
            artifactsStore.getState().selection.lastAutoOpenCodeBlockLocation;

          if (
            lastAutoOpenCodeBlockLocation &&
            lastAutoOpenCodeBlockLocation.messageBlockIndex === chunkIndex &&
            lastAutoOpenCodeBlockLocation.codeBlockIndex === codeIndex
          )
            continue;

          artifactsStore.setState((draft) => {
            draft.selection.selectedCodeBlockLocation = {
              messageBlockIndex: chunkIndex,
              codeBlockIndex: codeIndex,
            };
            draft.states.view =
              ARTIFACT_INITIAL_STATE[
                getInterpretedArtifactLanguage(
                  codeBlock.content.language as ArtifactLanguage,
                ) as ArtifactLanguage
              ];
            draft.states.hasAutoPreviewTriggered = false;
            draft.selection.lastAutoOpenCodeBlockLocation = {
              messageBlockIndex: chunkIndex,
              codeBlockIndex: codeIndex,
            };
            draft.ui.isArtifactsListOpen = false;
          });

          break messageBlockLoop;
        }
      }
    },
    [
      selectedCodeBlockLocation?.messageBlockIndex,
      selectedCodeBlockLocation?.codeBlockIndex,
      codeBlocksChunks,
      isArtifactOpen,
    ],
  );

  useEffect(
    function handleAutoPreview() {
      if (!codeBlocksChunks) return;

      const shouldTriggerAutoPreview =
        isArtifactOpen &&
        !hasAutoPreviewTriggered &&
        selectedCodeBlock &&
        !selectedCodeBlock.states.isInFlight &&
        selectedCodeBlock ===
          codeBlocksChunks[selectedCodeBlockLocation.messageBlockIndex]?.[
            selectedCodeBlockLocation.codeBlockIndex
          ];

      if (!shouldTriggerAutoPreview) return;

      artifactsStore.setState((draft) => {
        draft.states.hasAutoPreviewTriggered = true;
      });

      artifactsStore.setState((draft) => {
        draft.states.view = "preview";
      });
    },
    [
      selectedCodeBlock,
      isArtifactOpen,
      hasAutoPreviewTriggered,
      selectedCodeBlockLocation,
      codeBlocksChunks,
    ],
  );
}
