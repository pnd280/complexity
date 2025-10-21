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
    dependencies: ["cache:pluginsEnableStates", "cache:extensionSettings"],
    loader: ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (
        !pluginsEnableStates["queryBox:languageModelSelector"] ||
        !extensionSettings.plugins["queryBox:languageModelSelector"]
          .showModelSelectionMismatchWarning
      )
        return;

      threadMessageBlocksDomObserverStore.subscribe(
        (store) => store.messageBlocks,
        (messageBlocks) => {
          if (messageBlocks == null) return;

          for (const messageBlock of messageBlocks) {
            if (
              messageBlock.content.displayModel !== "turbo" &&
              messageBlock.content.userSelectedModel !==
                messageBlock.content.displayModel
            ) {
              const $displayModelButton =
                messageBlock.nodes.$displayModelButton;

              if (!$displayModelButton[0]) continue;

              $displayModelButton.addClass("cplx-model-mismatch-warning");
            }
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
