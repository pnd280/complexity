import KeyCombo from "@/components/KeyCombo";
import {
  CommandGroup,
  CommandItem,
  CommandItemIcon,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import { useColorSchemeStore } from "@/plugins/__async-deps__/global-stores/color-scheme-store";
import usePplxIncognitoMode from "@/plugins/__async-deps__/hooks/usePplxIncognitoMode";
import { useSpaRouter } from "@/plugins/__core__/_main-world/spa-router/utils";
import CommandItemGuard from "@/plugins/command-menu/components/CommandItemGuard";
import { getRawItems } from "@/plugins/command-menu/items/actions/items";
import { commandMenuStore } from "@/plugins/command-menu/store";
import { getGroupedItems } from "@/plugins/command-menu/utils";
import { whereAmI } from "@/utils/misc/utils";

export default function ActionItems() {
  const url = useSpaRouter((store) => store.url);
  const location = whereAmI(url);
  const isIncognito = usePplxIncognitoMode();
  const colorScheme = useColorSchemeStore((store) => store.colorScheme);

  const items = getGroupedItems({
    getter: getRawItems,
    params: {
      isIncognito,
      colorScheme,
      location,
    },
  });

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
              <CommandItem
                value={item.value}
                keywords={item.keywords}
                onSelect={() => {
                  item.onSelect();
                  commandMenuStore.getState().states.setOpen(false);
                }}
              >
                <CommandItemIcon asChild>
                  <item.icon />
                </CommandItemIcon>
                <CommandItemTitle>{item.title}</CommandItemTitle>
                <CommandItemRightAttributes asChild>
                  <KeyCombo keyClassName="x:text-sm" keys={item.keybinding} />
                </CommandItemRightAttributes>
              </CommandItem>
            </CommandItemGuard>
          ))}
        </CommandGroup>
      ))}
    </>
  );
}
