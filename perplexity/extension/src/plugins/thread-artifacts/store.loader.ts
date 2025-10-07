import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import {
  spaRouteChangeCompleteSubscribe,
  spaRouterStoreSubscribe,
} from "@/plugins/__core__/_main-world/spa-router/utils";
import { threadCodeBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/code-blocks/store";
import type { CodeBlock } from "@/plugins/__core__/dom-observers/thread/code-blocks/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { ARTIFACT_PLACEHOLDERS } from "@/plugins/thread-artifacts/consts";
import {
  artifactsStore,
  type ArtifactBlock,
  type CodeBlockLocation,
} from "@/plugins/thread-artifacts/store";
import type { ArtifactLanguage } from "@/plugins/thread-artifacts/types";
import {
  formatArtifactTitle,
  getArtifactTitle,
  getInterpretedArtifactLanguage,
  isAutonomousArtifactLanguageString,
} from "@/plugins/thread-artifacts/utils";
import { scrollToElement } from "@/utils/dom-utils/generics";
import { parseUrl, whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:artifacts:resetOpenStateOnRouteChange": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:artifacts:resetOpenStateOnRouteChange",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:artifacts"]) return;

      spaRouteChangeCompleteSubscribe((url) => {
        if (whereAmI(url) !== "thread")
          artifactsStore.setState({
            isArtifactsListOpen: false,
            selectedCodeBlockLocation: null,
          });
      });

      initializeAutonomousMode();

      emitResizeEvent();

      closeOnRouteChange();
    },
  });
}

const initializeAutonomousMode = () => {
  threadCodeBlocksDomObserverStore.subscribe(
    (store) => store.codeBlocksChunks,
    (codeBlocksChunks, prevCodeBlocksChunks) => {
      if (!codeBlocksChunks || !prevCodeBlocksChunks) return;

      const getTotalBlocks = (chunks: CodeBlock[][]) =>
        chunks.reduce((acc, blocks) => acc + blocks.length, 0);

      if (
        getTotalBlocks(codeBlocksChunks) !==
        getTotalBlocks(prevCodeBlocksChunks)
      ) {
        artifactsStore.getState().setLastAutoOpenCodeBlockLocation(null);
      }
    },
    {
      equalityFn: deepEqual,
    },
  );

  threadCodeBlocksDomObserverStore.subscribe(
    (store) => store.codeBlocksChunks,
    (codeBlocksChunks) => {
      if (!codeBlocksChunks) return;

      requestIdleCallback(
        () => {
          const newArtifactBlocks: Record<string, ArtifactBlock> = {};

          codeBlocksChunks.forEach((chunks, chunkIndex) => {
            chunks.forEach((codeBlock, codeBlockIndex) => {
              if (
                codeBlock == null ||
                !codeBlock.content.language ||
                !isAutonomousArtifactLanguageString(codeBlock.content.language)
              )
                return;

              const key = getArtifactTitle(codeBlock.content.language);
              const interpretedLanguage = getInterpretedArtifactLanguage(
                codeBlock.content.language,
              );

              if (!(interpretedLanguage in ARTIFACT_PLACEHOLDERS)) return;

              updateArtifactBlocks({
                key,
                newArtifactBlocks,
                codeBlock,
                messageBlockIndex: chunkIndex,
                codeBlockIndex,
                interpretedLanguage: interpretedLanguage as ArtifactLanguage,
              });
            });
          });

          artifactsStore.setState((draft) => {
            draft.artifactBlocks = newArtifactBlocks;
          });
        },
        { timeout: 2000 },
      );
    },
    {
      equalityFn: deepEqual,
    },
  );
};

const updateArtifactBlocks = ({
  newArtifactBlocks,
  key,
  codeBlock,
  messageBlockIndex,
  codeBlockIndex,
  interpretedLanguage,
}: {
  newArtifactBlocks: Record<string, ArtifactBlock>;
  key: string;
  codeBlock: CodeBlock;
  messageBlockIndex: number;
  codeBlockIndex: number;
  interpretedLanguage: ArtifactLanguage;
}) => {
  const location = { messageBlockIndex, codeBlockIndex };
  const placeholder = ARTIFACT_PLACEHOLDERS[interpretedLanguage];
  const title = formatArtifactTitle(key) || placeholder.defaultTitle;

  if (newArtifactBlocks[key]) {
    newArtifactBlocks[key].count++;
    newArtifactBlocks[key].isInFlight = codeBlock.states.isInFlight;
    newArtifactBlocks[key].location.push(location);
  } else {
    newArtifactBlocks[key] = {
      Icon: placeholder.icon,
      title,
      description: placeholder.description,
      onClick: () =>
        handleArtifactBlockClick({
          messageBlockIndex:
            newArtifactBlocks[key]?.location.at(-1)?.messageBlockIndex ?? 0,
          codeBlockIndex:
            newArtifactBlocks[key]?.location.at(-1)?.codeBlockIndex ?? 0,
        }),
      isInFlight: codeBlock.states.isInFlight,
      count: 1,
      location: [location],
    };
  }
};

const handleArtifactBlockClick = (location: CodeBlockLocation) => {
  artifactsStore.setState((draft) => {
    draft.isArtifactsListOpen = false;
    draft.selectedCodeBlockLocation = location;
    draft.state = "preview";

    const selector = `${DomSelectorsService.Root.cplxAttribute(
      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE.BLOCK,
    )}[data-index="${location.messageBlockIndex}"] ${DomSelectorsService.Root.cplxAttribute(
      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE
        .MIRRORED_CODE_BLOCK,
    )}[data-index="${location.codeBlockIndex}"]`;
    scrollToElement($(selector), -100);
  });
};

const closeOnRouteChange = () => {
  spaRouterStoreSubscribe(
    (store) => ({ state: store.state, url: store.url }),
    ({ state, url }, { url: prevUrl }) => {
      if (state !== "complete" && url === prevUrl) return;

      if (
        parseUrl(prevUrl).queryParams.get("q") != null ||
        parseUrl(url).queryParams.get("q") != null
      )
        return;

      artifactsStore.getState().close();
    },
  );
};

const emitResizeEvent = () => {
  artifactsStore.subscribe((state, prevState) => {
    if (
      state.selectedCodeBlockLocation !== prevState.selectedCodeBlockLocation ||
      state.isArtifactsListOpen !== prevState.isArtifactsListOpen
    ) {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    }
  });
};
