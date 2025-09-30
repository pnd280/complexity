import { useThreadCodeBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/code-blocks/store";
import {
  artifactsStore,
  useArtifactsStore,
} from "@/plugins/thread-artifacts/store";
import {
  isAutonomousArtifactLanguageString,
  isArtifactLanguageString,
} from "@/plugins/thread-artifacts/utils";

export function useHandleArtifactsState() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  useEffect(
    function handleArtifactOpenStateChange() {
      if (!codeBlocksChunks) return;

      if (!selectedCodeBlockLocation) {
        artifactsStore.setState((draft) => {
          draft.isValidArtifactCode = false;
        });
        return;
      }

      const { messageBlockIndex, codeBlockIndex } = selectedCodeBlockLocation;
      const messageBlocks = codeBlocksChunks[messageBlockIndex];
      const codeBlock = messageBlocks?.[codeBlockIndex];

      const isValidArtifactCode =
        codeBlock?.content.code != null &&
        codeBlock?.content.language != null &&
        (isArtifactLanguageString(codeBlock.content.language) ||
          isAutonomousArtifactLanguageString(codeBlock.content.language));

      artifactsStore.setState((draft) => {
        draft.isValidArtifactCode = isValidArtifactCode;
      });
    },
    [codeBlocksChunks, selectedCodeBlockLocation],
  );

  useEffect(
    function handleArtifactClose() {
      if (!selectedCodeBlockLocation || !codeBlocksChunks) return;

      const { messageBlockIndex, codeBlockIndex } = selectedCodeBlockLocation;
      const codeBlockExists =
        codeBlocksChunks[messageBlockIndex]?.[codeBlockIndex] != null;

      if (!codeBlockExists) {
        artifactsStore.getState().close();
      }
    },
    [selectedCodeBlockLocation, codeBlocksChunks],
  );
}
