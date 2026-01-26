import { toast } from "@/components/ui/use-toast";
import {
  openInNewTab,
  softNavigate,
} from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";
import usePplxSpaces from "@/plugins/command-menu/pages/spaces/usePplxSpaces";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";

export default function SpacesSearchItemsFooter() {
  const { data: spaces } = usePplxSpaces();

  const selectingValue = useCommandMenuStore(
    (store) => store.states.selectingValue,
  );

  useEffect(() => {
    if (!selectingValue) return;

    const space = spaces?.find((space) => space.uuid === selectingValue);

    if (!space) return;

    // TODO: bind keys to actions, prevent duplication in the Item itself
    commandMenuStore.getState().footer.setItems([
      {
        title: t("plugin-command-menu.spaces.footer.copyId"),
        keybinding: [getPlatform() === "mac" ? Key.Meta : Key.Control, "c"],
        onSelect: async () => {
          await navigator.clipboard.writeText(space.uuid);

          toast({
            title: t("plugin-command-menu.spaces.footer.copyIdSuccess"),
            description: space.uuid,
          });
        },
      },
      {
        title: t("plugin-command-menu.spaces.footer.openInNewTab"),
        keybinding: [Key.Alt, Key.Enter],
        onSelect: () => {
          void openInNewTab(`/spaces/${space.slug}`);
          commandMenuStore.getState().states.setOpen(false);
        },
      },
      {
        title: t("plugin-command-menu.spaces.footer.searchInSpace"),
        keybinding: [Key.Shift, Key.Enter],
        onSelect: () => {
          commandMenuStore.getState().pagesStack.push({
            pageId: "spaceThreads",
            args: {
              spaceSlug: space.slug,
            },
            searchPlaceholder: t(
              "plugin-command-menu.spaces.footer.searchSpacePlaceholder",
              { spaceName: space.title },
            ),
            shouldLocalFilter: true,
            sidecarOpen: false,
          });
        },
      },
      {
        title: t("plugin-command-menu.spaces.footer.goToSpace"),
        keybinding: [Key.Enter],
        onSelect: () => {
          void softNavigate(`/spaces/${space.slug}`);
          commandMenuStore.getState().states.setOpen(false);
        },
      },
    ]);

    return () => {
      commandMenuStore.getState().footer.setItems([]);
    };
  }, [selectingValue, spaces]);

  return null;
}
