import KeyCombo from "@/components/KeyCombo";
import { Badge } from "@/components/ui/badge";
import {
  CommandGroup,
  CommandItem,
  CommandItemIcon,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import { useSpaRouter } from "@/plugins/_core/main-world/spa-router/utils";
import CommandItemGuard from "@/plugins/command-menu/components/CommandItemGuard";
import NavigationItemsFooter from "@/plugins/command-menu/items/navigations/Footer";
import { getRawItems } from "@/plugins/command-menu/items/navigations/items";
import { commandMenuStore } from "@/plugins/command-menu/store";
import { getGroupedItems } from "@/plugins/command-menu/utils";
import { whereAmI } from "@/utils/misc/utils";

const locationMap = {
  home: "home",
  library: "library",
  spaces: "collections_page",
  discover: "discover",
  details: "settings",
} as const satisfies Record<string, ReturnType<typeof whereAmI>>;

export default function NavigationItems() {
  const url = useSpaRouter((state) => state.url);
  const location = whereAmI(url);

  const items = useMemo(
    () =>
      getGroupedItems({
        getter: getRawItems,
        params: {},
      }),
    [],
  );

  return (
    <>
      {items.map(({ groupName, items }) => (
        <CommandGroup key={groupName} heading={groupName}>
          {items.map((item) => (
            <CommandItemGuard
              key={item.value}
              show={item.show}
              eager={item.eager}
            >
              <a href={item.url}>
                <CommandItem
                  value={item.value}
                  keywords={item.keywords}
                  onSelect={() => {
                    item.onSelect();
                    commandMenuStore.getState().setOpen(false);
                  }}
                >
                  <CommandItemIcon asChild>
                    <item.icon />
                  </CommandItemIcon>

                  <CommandItemTitle className="x:flex x:items-center x:gap-4">
                    <div>{item.title}</div>
                    {location ===
                      locationMap[item.value as keyof typeof locationMap] && (
                      <Badge variant="outline">
                        {t("plugin-command-menu.navigation.current")}
                      </Badge>
                    )}
                  </CommandItemTitle>

                  <CommandItemRightAttributes asChild>
                    <KeyCombo keyClassName="x:text-sm" keys={item.keybinding} />
                  </CommandItemRightAttributes>
                </CommandItem>
              </a>
            </CommandItemGuard>
          ))}
        </CommandGroup>
      ))}
      <NavigationItemsFooter items={items} />
    </>
  );
}
