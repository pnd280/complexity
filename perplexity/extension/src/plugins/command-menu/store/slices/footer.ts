import type { CommandMenuStoreType } from "@/plugins/command-menu/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/command-menu/store" {
  interface CommandMenuStoreType {
    footer: FooterSlice;
  }
}

export type FooterItem = {
  title: string;
  keybinding?: string[];
  onSelect?: () => void;
};

export type FooterSlice = {
  items: FooterItem[];
  setItems: (items: FooterItem[]) => void;
};

export const createFooterSlice: SliceCreator<
  FooterSlice,
  CommandMenuStoreType
> = (set) => ({
  items: [],
  setItems: (items) =>
    set((draft) => {
      draft.footer.items = items;
    }),
});
