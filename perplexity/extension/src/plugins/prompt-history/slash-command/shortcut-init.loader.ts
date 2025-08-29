import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { tabId } from "@/plugins/prompt-history/slash-command/slash-command-menu-tab";
import {
  getAnchor,
  slashCommandMenuStore,
} from "@/plugins/slash-command/index.public";
import { ExtensionSettingsService } from "@/services/infra/extension-settings";
import hotkeysJs from "@/utils/hotkeys-js";
import { keysToString } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:shortcut-init": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:shortcut-init",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["slashCommand"] || !pluginsStates["promptHistory"])
        return;

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
            store.setActiveContentTab(tabId);

            store.setOpen(true);
          });
        });
      } else {
        slashCommandMenuStore.getState().registerContentTabCommandShortcut({
          tab: tabId,
          commandShortcuts: shortcut.value,
        });
      }
    },
  });
}
