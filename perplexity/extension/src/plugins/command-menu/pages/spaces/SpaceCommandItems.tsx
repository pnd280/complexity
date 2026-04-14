import { useHotkey } from "@tanstack/react-hotkeys";

import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import { CommandItemSkeleton } from "@/components/ui/command";
import { toast } from "@/components/ui/use-toast";
import SpacesSearchItemsFooter from "@/plugins/command-menu/pages/spaces/Footer";
import SpacesSearchItemsSidecar from "@/plugins/command-menu/pages/spaces/Sidecar";
import SpaceCommandItem from "@/plugins/command-menu/pages/spaces/SpaceCommandItem";
import usePplxSpaces from "@/plugins/command-menu/pages/spaces/usePplxSpaces";
import { useCommandMenuStore } from "@/plugins/command-menu/store";
import { keysToString } from "@/utils/misc/utils";
import { parseHotkeyCombo } from "@/utils/wrappers/hotkeys-js";

export default function SpaceCommandItems() {
  const open = useCommandMenuStore((store) => store.states.open);

  const { data, isLoading, isError } = usePplxSpaces();

  const value = useCommandMenuStore((store) => store.states.selectingValue);

  useHotkey(
    parseHotkeyCombo(keysToString([Key.Control, "c"])),
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      void navigator.clipboard.writeText(value).then(() => {
        toast({
          title: t("plugin-command-menu.spaces.footer.copyIdSuccess"),
          description: value,
        });
      });
    },
    {
      enabled: open,
      preventDefault: false,
      stopPropagation: false,
      ignoreInputs: false,
    },
  );

  if (isLoading) return <CommandItemSkeleton count={5} />;
  if (isError)
    return (
      <CommandEmpty>
        {t("plugin-command-menu.spaces.commandItems.errorFetching")}
      </CommandEmpty>
    );

  return (
    <>
      <CommandGroup>
        {data?.map((space) => (
          <SpaceCommandItem key={space.uuid} space={space} />
        ))}
      </CommandGroup>
      <SpacesSearchItemsFooter />
      <SpacesSearchItemsSidecar />
      <CommandEmpty>
        {t("plugin-command-menu.spaces.commandItems.noSpacesFound")}
      </CommandEmpty>
    </>
  );
}
