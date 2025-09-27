import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getRawItems } from "@/plugins/command-menu/items/searches/items";
import { commandMenuStore } from "@/plugins/command-menu/store";
import { keysToString } from "@/utils/misc/utils";
import hotkeysJs from "@/utils/wrappers/hotkeys-js";

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
