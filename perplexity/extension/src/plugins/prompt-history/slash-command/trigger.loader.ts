import { slashCommandMenuStore } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store";
import { registerPageCommand } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/utils";
import { getAnchor } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import { getTaskScheduler, keysToString } from "@/utils/misc/utils";
import hotkeys from "@/utils/wrappers/hotkeys-js";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:shortcut-init": void;
  }
}

const pageId = "promptHistory" as const;

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:shortcut-init",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["promptHistory"]) return;

      const shortcut =
        PluginsSettingSnapshotsService.getPluginSnapshot(
          "promptHistory",
        ).shortcut;

      if (shortcut.type === "keybinding") {
        hotkeys(keysToString(shortcut.value), () => {
          const target = document.activeElement;

          if (!target || !(target instanceof HTMLElement)) return;

          const anchor = getAnchor(target);

          if (!anchor) return;

          getTaskScheduler()(() => {
            const selection = anchor.contentActions?.getSelection();

            if (!selection) return;

            const store = slashCommandMenuStore.getState();

            store.anchor.setBufferTextCaretPosition(selection.start);

            store.anchor.actions.setElement(anchor.element);
            store.anchor.actions.setInputField(target);
            store.anchor.actions.setPositioningOptions(
              anchor.positioningOptions,
            );
            store.anchor.actions.setContentActions(anchor.contentActions);
            store.pagesStack.pushPage({
              pageId,
              args: undefined,
            });
            store.anchor.actions.setPortalContainer(anchor.portalContainer);

            store.states.setOpen(true);
          });
        });
      } else {
        registerPageCommand(shortcut.value, pageId);
      }
    },
  });
}
