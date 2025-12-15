import KeyCombo from "@/components/KeyCombo";
import { Badge } from "@/components/ui/badge";
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
  CommandPage,
  getGroupedItems,
} from "@/plugins/command-menu/index.public";
import { getRawModelItems } from "@/plugins/image-gen-model-selector/command-menu/model-items";
import { useImageGenModelSelectorStore } from "@/plugins/image-gen-model-selector/store";

export function ImageGenModelsPage() {
  const currentModel = useImageGenModelSelectorStore((state) => state.model);

  const items = getGroupedItems({
    getter: getRawModelItems,
    params: { currentModel },
  });

  return (
    <CommandPage pageId="imageGenModels">
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
                <CommandItemTitle className="x:flex x:items-center x:gap-2">
                  <span>{item.title}</span>
                  {item.titleSuffixBadge && (
                    <Badge variant="outline">{item.titleSuffixBadge}</Badge>
                  )}
                </CommandItemTitle>
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
