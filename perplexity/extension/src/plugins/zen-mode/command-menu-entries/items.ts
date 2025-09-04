import { LuGrid3X3 } from "react-icons/lu";
import { LuLayoutGrid } from "react-icons/lu";

import type { CommandItemProps } from "@/plugins/command-menu/index.public";
import { toggleZenMode } from "@/plugins/zen-mode/utils";
import { ExtensionSettingsService } from "@/services/extension-settings";

type ItemsParams = {
  isZenMode: boolean;
};

export const getRawItems = ({ isZenMode }: ItemsParams): CommandItemProps[] => [
  {
    eager: true,
    group: "Zen Mode",
    icon: isZenMode ? LuGrid3X3 : LuLayoutGrid,
    keybinding: ExtensionSettingsService.cachedSync.plugins["zenMode"].hotkey,
    keywords: ["actions", "zen", "mode"],
    onSelect: () => toggleZenMode(!isZenMode),
    priority: 0,
    show: true,
    title: isZenMode ? "Disable Zen Mode" : "Enable Zen Mode",
    value: isZenMode ? "disable-zen-mode" : "enable-zen-mode",
  },
];
