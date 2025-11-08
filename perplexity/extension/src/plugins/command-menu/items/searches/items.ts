import PplxSpace from "@/components/icons/PplxSpace";
import PplxThread from "@/components/icons/PplxThread";
import { commandMenuStore } from "@/plugins/command-menu/store";
import type { CommandItemProps } from "@/plugins/command-menu/types";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export const getRawItems = (): CommandItemProps[] => [
  {
    eager: true,
    group: t("plugin-command-menu.groups.search"),
    icon: PplxThread,
    keybinding:
      ExtensionSettingsService.cachedSync.plugins.commandMenu.keybindings
        .threadsSearch,
    keywords: ["search"],
    onSelect: () => {
      commandMenuStore.getState().pagesStack.push({
        pageId: "threads",
        searchPlaceholder: t("plugin-command-menu.search.threadsPlaceholder"),
        shouldLocalFilter: false,
        sidecarOpen: false,
        args: {},
      });
    },
    priority: 0,
    show: true,
    title: t("plugin-command-menu.search.threads"),
    value: "search-threads",
  },
  {
    eager: true,
    group: t("plugin-command-menu.groups.search"),
    icon: PplxSpace,
    keybinding:
      ExtensionSettingsService.cachedSync.plugins.commandMenu.keybindings
        .spacesSearch,
    keywords: ["search"],
    onSelect: () => {
      commandMenuStore.getState().pagesStack.push({
        pageId: "spaces",
        searchPlaceholder: t("plugin-command-menu.search.spacesPlaceholder"),
        shouldLocalFilter: true,
        sidecarOpen: false,
        args: undefined,
      });
    },
    priority: 0,
    show: true,
    title: t("plugin-command-menu.search.spaces"),
    value: "search-spaces",
  },
];
