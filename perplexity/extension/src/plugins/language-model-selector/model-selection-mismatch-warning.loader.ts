import { threadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:languageModelSelector:modelSelectionMismatchWarning": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:languageModelSelector:modelSelectionMismatchWarning",
    dependencies: [
      "cache:pluginsEnableStatesV2",
      "cache:pluginSettingSnapshots",
      "store:pluginGuards",
    ],
    loader: ({
      "cache:pluginsEnableStatesV2": pluginsEnableStates,
      "cache:pluginSettingSnapshots": pluginSettingSnapshots,
      "store:pluginGuards": pluginGuards,
    }) => {
      if (
        !pluginsEnableStates["queryBox:languageModelSelector"] ||
        !pluginSettingSnapshots["queryBox:languageModelSelector"]
          .showModelSelectionMismatchWarning ||
        pluginGuards.subTier == null
      )
        return;

      threadMessageBlocksDomObserverStore.subscribe(
        (store) => store.messageBlocks,
        (messageBlocks) => {
          if (messageBlocks == null) return;

          for (const messageBlock of messageBlocks) {
            messageBlock.nodes.$displayModelButton.toggleClass(
              "cplx-model-mismatch-warning",
              messageBlock.content.userSelectedModel != null &&
                messageBlock.content.userSelectedModel !==
                  messageBlock.content.displayModel,
            );
          }
        },
        {
          equalityFn: deepEqual,
          fireImmediately: true,
        },
      );
    },
  });
}
