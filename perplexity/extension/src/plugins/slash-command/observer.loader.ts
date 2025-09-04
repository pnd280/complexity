import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { slashCommandMenuStore } from "@/plugins/slash-command/store";
import {
  getMatchedContentTabCommand,
  isAllowedKey,
} from "@/plugins/slash-command/store/slices/content-tab/utils";
import { getAnchor } from "@/plugins/slash-command/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:slashCommandMenu:observer": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:slashCommandMenu:observer",
    dependencies: ["cache:pluginsStates"],
    loader: async () => {
      $(document.body).on("keydown", (e) => {
        if (!isAllowedKey(e as unknown as KeyboardEvent)) return;

        const target = e.target;

        const anchor = getAnchor(target);

        if (!anchor) return;

        requestAnimationFrame(() => {
          const wordAtCaret = anchor.contentActions?.getWordAtCaret();

          if (
            !wordAtCaret ||
            wordAtCaret.value.length <= 2 ||
            !wordAtCaret.value.startsWith("//")
          )
            return;

          const command = getMatchedContentTabCommand({
            wordAtCaret: wordAtCaret.value,
          });

          if (!command) return;

          e.stopPropagation();
          e.preventDefault();

          const store = slashCommandMenuStore.getState();

          store.setBufferTextCaretPosition(wordAtCaret.start);
          store.setBufferText(wordAtCaret.value);

          anchor.contentActions?.deleteTriggerPhrase();

          store.anchor.actions.setElement(anchor.element);
          store.anchor.actions.setInputField(target);
          store.anchor.actions.setPositioningOptions(anchor.positioningOptions);
          store.anchor.actions.setContentActions(anchor.contentActions);
          store.setActiveContentTab(command);
          store.setOpen(true);
        });
      });

      slashCommandMenuStore.subscribe(
        (state) => state.open,
        (open) => {
          if (open) return;

          requestAnimationFrame(() => {
            slashCommandMenuStore.getState().anchor.inputField?.focus();
            slashCommandMenuStore.getState().restoreText();
          });
        },
      );
    },
  });
}
