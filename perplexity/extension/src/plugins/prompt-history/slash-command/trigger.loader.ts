import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
const pageId = "promptHistory" as const;
import { slashCommandMenuStore } from "@/plugins/__core__/slash-command/store";
import { getAnchor } from "@/plugins/__core__/slash-command/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { keysToString } from "@/utils/misc/utils";
import hotkeysJs from "@/utils/wrappers/hotkeys-js";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:shortcut-init": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:shortcut-init",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["promptHistory"]) return;

      const shortcut =
        ExtensionSettingsService.cachedSync.plugins["promptHistory"].shortcut;

      if (shortcut.type === "keybinding") {
        hotkeysJs(keysToString(shortcut.value), () => {
          const target = document.activeElement;

          if (!target || !(target instanceof HTMLElement)) return;

          const anchor = getAnchor(target);

          if (!anchor) return;

          requestAnimationFrame(() => {
            const selection = anchor.contentActions?.getSelection();

            if (!selection) return;

            const store = slashCommandMenuStore.getState();

            store.setBufferTextCaretPosition(selection.start);

            store.anchor.actions.setElement(anchor.element);
            store.anchor.actions.setInputField(target);
            store.anchor.actions.setPositioningOptions(
              anchor.positioningOptions,
            );
            store.anchor.actions.setContentActions(anchor.contentActions);
            store.pushPage({
              pageId,
              args: undefined,
            });

            store.setOpen(true);
          });
        });
      } else {
        // TODO: implement registration for command
        // src\plugins\slash-command\store\slices\pages\utils.ts
      }
    },
  });
}
