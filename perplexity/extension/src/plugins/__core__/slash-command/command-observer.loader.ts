import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { slashCommandMenuStore } from "@/plugins/__core__/slash-command/store";
import {
  getMatchedPageCommand,
  isAllowedKey,
} from "@/plugins/__core__/slash-command/store/slices/pages/utils";
import { getAnchor } from "@/plugins/__core__/slash-command/utils";
import { getTaskScheduler } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:slashCommandMenu:observer": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:slashCommandMenu:observer",
    dependencies: ["cache:corePlugins:enableStates"],
    loader: async ({ "cache:corePlugins:enableStates": enableStates }) => {
      if (!enableStates["slashCommand"]) return;

      $(document.body).on("keydown", (e) => {
        if (!isAllowedKey(e as unknown as KeyboardEvent)) return;

        const target = e.target;

        const anchor = getAnchor(target);

        if (!anchor) return;

        getTaskScheduler()(() => {
          const wordAtCaret = anchor.contentActions?.getWordAtCaret();

          if (
            !wordAtCaret ||
            wordAtCaret.value.length <= 2 ||
            !wordAtCaret.value.startsWith("//")
          )
            return;

          const pageId = getMatchedPageCommand({
            wordAtCaret: wordAtCaret.value,
          });

          if (!pageId) return;

          e.stopPropagation();
          e.preventDefault();

          const store = slashCommandMenuStore.getState();

          store.anchor.setBufferTextCaretPosition(wordAtCaret.start);
          store.anchor.setBufferText(wordAtCaret.value);

          anchor.contentActions?.deleteTriggerPhrase();

          store.anchor.actions.setElement(anchor.element);
          store.anchor.actions.setInputField(target);
          store.anchor.actions.setPositioningOptions(anchor.positioningOptions);
          store.anchor.actions.setContentActions(anchor.contentActions);

          store.pagesStack.pushPage({
            pageId,
            args: undefined,
          });

          store.states.setOpen(true);
        });
      });

      slashCommandMenuStore.subscribe(
        (store) => store.states.open,
        (open) => {
          if (open) return;

          getTaskScheduler()(() => {
            slashCommandMenuStore.getState().anchor.inputField?.focus();
            slashCommandMenuStore.getState().anchor.restoreText();
          });
        },
      );
    },
  });
}
