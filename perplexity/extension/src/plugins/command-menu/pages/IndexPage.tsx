import CsUiRegistry from "@/__registries__/cs-ui";
import { CommandEmpty } from "@/components/ui/command";
import CommandPage from "@/plugins/command-menu/components/CommandPage";
import ActionItems from "@/plugins/command-menu/items/actions/ActionItems";
import NavigationItems from "@/plugins/command-menu/items/navigations/NavigationItems";
import SearchItems from "@/plugins/command-menu/items/searches/SearchItems";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    commandMenu: never;
  }
}

const IndexPage = memo(() => {
  return (
    <CommandPage pageId={null}>
      <ActionItems />
      <SearchItems />
      <NavigationItems />

      {CsUiRegistry.CommandMenuItemsGroupComponents}

      <CommandEmpty>{t("plugin-command-menu.common.noResults")}</CommandEmpty>
    </CommandPage>
  );
});

export default IndexPage;
