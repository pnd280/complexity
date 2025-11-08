import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:languageModelSelector:modelSelectionMismatchWarning": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:languageModelSelector:modelSelectionMismatchWarning",
    dependencies: [
      "cache:pluginsEnableStates",
      "cache:extensionSettings",
      "store:pluginGuards",
    ],
    loader: ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
      "store:pluginGuards": pluginGuards,
    }) => {
      if (
        !pluginsEnableStates["queryBox:languageModelSelector"] ||
        !extensionSettings.plugins["queryBox:languageModelSelector"]
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
