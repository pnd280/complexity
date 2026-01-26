import KeyCombo from "@/components/KeyCombo";
import {
  CommandGroup,
  CommandItem,
  CommandItemIcon,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import CommandItemGuard from "@/plugins/command-menu/components/CommandItemGuard";
import { getRawItems } from "@/plugins/command-menu/items/searches/items";
import { getGroupedItems } from "@/plugins/command-menu/utils";

export default function SearchItems() {
  const items = getGroupedItems({
    getter: getRawItems,
    params: {},
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
                onSelect={item.onSelect}
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
