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
  commandMenuStore,
} from "@/plugins/command-menu/index.public";
import { getGroupedItems } from "@/plugins/command-menu/index.public";
import { getRawItems } from "@/plugins/zen-mode/command-menu/items";
import useZenMode from "@/plugins/zen-mode/hook/useZenMode";

export function ZenModeCommandMenuEntries() {
  const isZenMode = useZenMode();

  const items = useMemo(
    () =>
      getGroupedItems({
        getter: getRawItems,
        params: { isZenMode },
      }),
    [isZenMode],
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
