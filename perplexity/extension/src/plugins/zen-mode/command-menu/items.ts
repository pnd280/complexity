import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import type { CommandItemProps } from "@/plugins/command-menu/index.public";
import { toggleZenMode } from "@/plugins/zen-mode/utils";

import LuGrid3X3 from "~icons/lucide/grid-3x3";
import LuLayoutGrid from "~icons/lucide/layout-grid";

type ItemsParams = {
  isZenMode: boolean;
};

export const getRawItems = ({ isZenMode }: ItemsParams): CommandItemProps[] => [
  {
    eager: true,
    group: "Zen Mode",
    icon: isZenMode ? LuGrid3X3 : LuLayoutGrid,
    keybinding:
      PluginsSettingSnapshotsService.getPluginSnapshot("zenMode").hotkey,
    keywords: ["actions", "zen", "mode"],
    onSelect: () => toggleZenMode(!isZenMode),
    priority: 0,
    show: true,
    title: isZenMode ? "Disable Zen Mode" : "Enable Zen Mode",
    value: isZenMode ? "disable-zen-mode" : "enable-zen-mode",
  },
];
