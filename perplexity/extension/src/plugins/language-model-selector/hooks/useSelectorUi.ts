import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

export type SelectorUIComponents = {
  Group: typeof DropdownMenuGroup | typeof SelectGroup;
  Label: typeof DropdownMenuLabel | typeof SelectLabel;
  Item: typeof DropdownMenuItem | typeof SelectItem;
};

export function useSelectorUi(): SelectorUIComponents {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { type } = context;

  const isDropdown = type === "rewrite";

  return {
    Group: isDropdown ? DropdownMenuGroup : SelectGroup,
    Label: isDropdown ? DropdownMenuLabel : SelectLabel,
    Item: isDropdown ? DropdownMenuItem : SelectItem,
  };
}
