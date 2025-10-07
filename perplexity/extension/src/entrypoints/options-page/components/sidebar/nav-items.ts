import TablerFileText from "~icons/tabler/file-text";
import TablerPalette from "~icons/tabler/palette";
import TablerPuzzle from "~icons/tabler/puzzle";
import TablerSettings from "~icons/tabler/settings";

export type NavItem = {
  icon?: React.ElementType;
  label: string;
  path: string;
  children?: NavItem[];
  expanded?: boolean;
};

export const defaultNavItems: NavItem[] = [
  {
    icon: TablerPuzzle,
    label: "Plugins",
    path: "/plugins",
  },
  {
    icon: TablerPalette,
    label: "Themes",
    path: "/themes",
  },
  {
    icon: TablerFileText,
    label: "Release Notes",
    path: "/release-notes",
  },
  {
    icon: TablerSettings,
    label: "Settings",
    path: "/settings",
  },
];
