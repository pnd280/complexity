import {
  openInNewTab,
  softNavigate,
} from "@/plugins/__core__/_main-world/spa-router/utils";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";
import type { CommandItemProps } from "@/plugins/command-menu/types";
import {
  createItemsMap,
  type getGroupedItems,
} from "@/plugins/command-menu/utils";

export default function NavigationItemsFooter({
  items,
}: {
  items: ReturnType<typeof getGroupedItems<unknown, CommandItemProps>>;
}) {
  const selectingValue = useCommandMenuStore((store) => store.selectingValue);

  const itemsMap = createItemsMap(items);

  useEffect(() => {
    if (!selectingValue) return;

    const selectedItem = itemsMap.get(selectingValue);

    if (!selectedItem) return;

    const url = `https://${window.location.hostname}/${selectedItem.value !== "home" ? selectedItem.value : ""}`;

    commandMenuStore.getState().setFooterItems([
      {
        title: t("plugin-command-menu.navigation.openInNewTab"),
        keybinding: [Key.Alt, Key.Enter],
        onSelect: () => {
          void openInNewTab(url);
          commandMenuStore.getState().setOpen(false);
        },
      },
      {
        title: t("plugin-command-menu.navigation.goTo", {
          destination: selectedItem.title,
        }),
        keybinding: [Key.Enter],
        onSelect: () => {
          void softNavigate(url);
          commandMenuStore.getState().setOpen(false);
        },
      },
    ]);

    return () => {
      commandMenuStore.getState().setFooterItems([]);
    };
  }, [selectingValue, itemsMap]);

  return null;
}
