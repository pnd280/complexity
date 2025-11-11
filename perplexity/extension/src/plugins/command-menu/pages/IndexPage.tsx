import { CommandEmpty } from "@/components/ui/command";
import CommandPage from "@/plugins/command-menu/components/CommandPage";
import ActionItems from "@/plugins/command-menu/items/actions/ActionItems";
import NavigationItems from "@/plugins/command-menu/items/navigations/NavigationItems";
import SearchItems from "@/plugins/command-menu/items/searches/SearchItems";

export default function IndexPage() {
  return (
    <CommandPage pageId={null}>
      <ActionItems />
      <SearchItems />
      <NavigationItems />
      <CommandEmpty>{t("plugin-command-menu.common.noResults")}</CommandEmpty>
    </CommandPage>
  );
}
