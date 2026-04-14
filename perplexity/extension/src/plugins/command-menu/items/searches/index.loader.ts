import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { getRawItems } from "@/plugins/command-menu/items/searches/items";
import { commandMenuStore } from "@/plugins/command-menu/store";
import { keysToString } from "@/utils/misc/utils";
import hotkeys from "@/utils/wrappers/hotkeys-js";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:commandMenu:searchItems:setupKeybindings": void;
  }
}

let disposeSearchItemKeybindings: (() => void) | undefined;

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:commandMenu:searchItems:setupKeybindings",
    dependencies: ["cache:pluginsEnableStates"],
    loader({ "cache:pluginsEnableStates": pluginsEnableStates }) {
      disposeSearchItemKeybindings?.();
      disposeSearchItemKeybindings = undefined;

      if (!pluginsEnableStates.commandMenu) return;

      const items = getRawItems();
      const unbinders: Array<() => void> = [];

      items.forEach((item) => {
        if (item.keybinding.length === 0) {
          return;
        }

        const combo = keysToString(item.keybinding);
        const handler = () => {
          item.onSelect();
          commandMenuStore.getState().states.setOpen(true);
        };

        hotkeys(combo, handler);

        unbinders.push(() => {
          hotkeys.unbind(combo, handler);
        });
      });

      disposeSearchItemKeybindings = () => {
        unbinders.forEach((unbind) => {
          unbind();
        });
      };
    },
  });
}
