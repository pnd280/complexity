import CommandPage from "@/plugins/command-menu/components/CommandPage";
import SpaceCommandItems from "@/plugins/command-menu/pages/spaces/SpaceCommandItems";

declare module "@/plugins/command-menu/store/slices/pages/types" {
  interface CommandMenuPagesArgsRegistry {
    spaces: undefined;
  }
}

export default function SpacesPage() {
  return (
    <CommandPage pageId="spaces">
      <SpaceCommandItems />
    </CommandPage>
  );
}
