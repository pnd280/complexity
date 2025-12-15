import KeyCombo from "@/components/KeyCombo";
import {
  CommandGroup,
  CommandItem,
  CommandItemIcon,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import {
  CommandItemGuard,
  CommandPage,
  getGroupedItems,
} from "@/plugins/command-menu/index.public";
import { getRawItems } from "@/plugins/image-gen-model-selector/command-menu/items";

export function ImageGenModelSelectorCommandMenuEntries() {
  const items = getGroupedItems({
    getter: getRawItems,
    params: undefined,
  });

  return (
    <CommandPage pageId={null}>
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
    </CommandPage>
  );
}
