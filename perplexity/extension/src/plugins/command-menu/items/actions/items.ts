import { FaPlus } from "react-icons/fa6";
import { LuMoon, LuSun } from "react-icons/lu";

import Incognito from "@/components/icons/Incognito";
import { getPlatform } from "@/hooks/usePlatformDetection";
import {
  colorSchemeStore,
  type ColorScheme,
} from "@/plugins/_core/global-stores/color-scheme-store";
import { softNavigate } from "@/plugins/_core/main-world/spa-router/utils";
import type { CommandItemProps } from "@/plugins/command-menu/types";
import type { whereAmI } from "@/utils/utils";

type ActionItemsParams = {
  colorScheme: ColorScheme;
  isIncognito: boolean;
  location: ReturnType<typeof whereAmI>;
};

export const getRawItems = ({
  location,
  isIncognito,
  colorScheme,
}: ActionItemsParams): CommandItemProps[] => [
  {
    eager: true,
    group: t("plugin-command-menu.groups.actions"),
    icon: FaPlus,
    keybinding: [getPlatform() === "mac" ? Key.Meta : Key.Control, "i"],
    keywords: ["actions"],
    onSelect: () => softNavigate("/"),
    priority: 0,
    show: location !== "home",
    title: t("plugin-command-menu.actions.createNewThread"),
    value: "create-new-thread",
  },
  {
    eager: true,
    group: t("plugin-command-menu.groups.actions"),
    icon: Incognito,
    keybinding: [getPlatform() === "mac" ? Key.Meta : Key.Control, ";"],
    keywords: ["actions", "private", "temporary"],
    onSelect: () => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: ";",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    },
    priority: isIncognito ? 1 : 0,
    show: true,
    title: isIncognito
      ? t("plugin-command-menu.actions.toggleIncognitoDisable")
      : t("plugin-command-menu.actions.toggleIncognitoEnable"),
    value: "toggle-incognito-mode",
  },
  {
    eager: true,
    group: t("plugin-command-menu.groups.actions"),
    icon: colorScheme === "dark" ? LuSun : LuMoon,
    keybinding: [],
    keywords: ["actions", "light", "dark"],
    onSelect: () => {
      colorSchemeStore
        .getState()
        .setColorScheme(colorScheme === "dark" ? "light" : "dark");
    },
    priority: 0,
    show: true,
    title:
      colorScheme === "dark"
        ? t("plugin-command-menu.actions.toggleLightMode")
        : t("plugin-command-menu.actions.toggleDarkMode"),
    value: "toggle-color-scheme",
  },
];
