import {
  openInNewTab,
  softNavigate,
} from "@/plugins/__core__/_main-world/spa-router/utils";
import usePplxSpaces from "@/plugins/command-menu/pages/spaces/usePplxSpaces";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";

export default function SpacesSearchItemsFooter() {
  const { data: spaces } = usePplxSpaces();

  const selectingValue = useCommandMenuStore((store) => store.selectingValue);

  useEffect(() => {
    if (!selectingValue) return;

    const space = spaces?.find((space) => space.uuid === selectingValue);

    if (!space) return;

    commandMenuStore.getState().setFooterItems([
      {
        title: t("plugin-command-menu.spaces.footer.openInNewTab"),
        keybinding: [Key.Alt, Key.Enter],
        onSelect: () => {
          openInNewTab(`/spaces/${space?.slug}`);
          commandMenuStore.getState().setOpen(false);
        },
      },
      {
        title: t("plugin-command-menu.spaces.footer.searchInSpace"),
        keybinding: [Key.Shift, Key.Enter],
        onSelect: () => {
          commandMenuStore.getState().pushPage({
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
          softNavigate(`/spaces/${space?.slug}`);
          commandMenuStore.getState().setOpen(false);
        },
      },
    ]);

    return () => {
      commandMenuStore.getState().setFooterItems([]);
    };
  }, [selectingValue, spaces]);

  return null;
}
