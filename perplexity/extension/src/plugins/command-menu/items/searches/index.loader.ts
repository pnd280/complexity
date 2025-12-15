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

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:commandMenu:searchItems:setupKeybindings",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) {
      if (!pluginsEnableStates.commandMenu) return;

      const items = getRawItems();

      items.forEach((item) => {
        hotkeys(keysToString(item.keybinding), () => {
          item.onSelect();
          commandMenuStore.getState().states.setOpen(true);
        });
      });
    },
  });
}
