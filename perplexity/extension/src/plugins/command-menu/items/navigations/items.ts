import { isHotkeyPressed } from "react-hotkeys-hook";

import PplxDiscover from "@/components/icons/PplxDiscover";
import PplxLabs from "@/components/icons/PplxLabs";
import PplxSpace from "@/components/icons/PplxSpace";
import PplxThread from "@/components/icons/PplxThread";
import {
  openInNewTab,
  softNavigate,
} from "@/plugins/__core__/_main-world/spa-router/utils";
import type { CommandItemProps } from "@/plugins/command-menu/types";

import BiPplx from "~icons/bi/perplexity";
import TablerSettings from "~icons/tabler/settings";

export const navigationKeywords = ["navigation", "navigate", "go", "to"];

export type NavigationCommandItemProps = CommandItemProps & {
  url: string;
};

const createNavigationItem = ({
  icon,
  title,
  value,
  url,
}: Pick<
  NavigationCommandItemProps,
  "icon" | "title" | "value" | "url"
>): NavigationCommandItemProps => ({
  eager: true,
  group: t("plugin-command-menu.groups.navigation"),
  icon,
  keybinding: [],
  keywords: navigationKeywords,
  onSelect: () => {
    if (isHotkeyPressed(Key.Alt)) {
      void openInNewTab(url);
    } else {
      void softNavigate(url);
    }
  },
  priority: 0,
  show: true,
  title,
  url,
  value,
});

export const getRawItems = (): NavigationCommandItemProps[] => [
  createNavigationItem({
    icon: BiPplx,
    title: t("plugin-command-menu.navigation.home"),
    value: "home",
    url: "/",
  }),
  createNavigationItem({
    icon: PplxThread,
    title: t("plugin-command-menu.navigation.library"),
    value: "library",
    url: "/library",
  }),
  createNavigationItem({
    icon: PplxSpace,
    title: t("plugin-command-menu.navigation.spaces"),
    value: "spaces",
    url: "/spaces",
  }),
  createNavigationItem({
    icon: PplxDiscover,
    title: t("plugin-command-menu.navigation.discover"),
    value: "discover",
    url: "/discover",
  }),
  createNavigationItem({
    icon: TablerSettings,
    title: t("plugin-command-menu.navigation.settings"),
    value: "settings",
    url: "/account/details",
  }),
  createNavigationItem({
    icon: PplxLabs,
    title: t("plugin-command-menu.navigation.labs"),
    value: "labs",
    url: "https://labs.perplexity.ai/",
  }),
];
