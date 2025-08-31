import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getRawItems } from "@/plugins/command-menu/items/searches/items";
import { commandMenuStore } from "@/plugins/command-menu/store";
import hotkeysJs from "@/utils/hotkeys-js";
import { keysToString } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:commandMenu:searchItems:setupKeybindings": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:commandMenu:searchItems:setupKeybindings",
    dependencies: ["cache:pluginsStates"],
    loader({ "cache:pluginsStates": pluginsStates }) {
      if (!pluginsStates.commandMenu) return;

      const items = getRawItems();

      items.forEach((item) => {
        hotkeysJs(keysToString(item.keybinding), () => {
          item.onSelect();
          commandMenuStore.getState().setOpen(true);
        });
      });
    },
  });
}
