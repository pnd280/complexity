import type { CommandItemProps } from "@/plugins/command-menu/index.public";
import { commandMenuStore } from "@/plugins/command-menu/index.public";

import TablerPhoto from "~icons/tabler/photo";

export const getRawItems = (): CommandItemProps[] => [
  {
    eager: true,
    group: "Image Generation Model Selector",
    icon: TablerPhoto,
    keybinding: [],
    keywords: ["img", "image", "model", "generator", "change"],
    onSelect: () => {
      commandMenuStore.getState().pagesStack.push({
        pageId: "imageGenModels",
        searchPlaceholder: "Search available models...",
        shouldLocalFilter: true,
        sidecarOpen: false,
        args: undefined,
      });
    },
    priority: 0,
    show: true,
    title: "Change Model",
    value: "change-image-model",
  },
];
