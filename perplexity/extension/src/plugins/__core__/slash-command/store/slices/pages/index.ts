import type { SlashCommandMenuStoreType } from "@/plugins/__core__/slash-command/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/__core__/slash-command/store" {
  interface SlashCommandMenuStoreType {
    pages: PagesSlice;
  }
}

export type PagesSlice = {
  pages: React.ReactElement[];
  addPage: (page: React.ReactElement) => void;
  removePage: (page: React.ReactElement) => void;
};

export const createPagesSlice: SliceCreator<
  PagesSlice,
  SlashCommandMenuStoreType
> = (set) => ({
  pages: [],
  addPage: (page) => {
    set((draft) => {
      draft.pages.pages.push(page);
    });
  },
  removePage: (page) => {
    set((draft) => {
      draft.pages.pages = draft.pages.pages.filter((p) => p !== page);
    });
  },
});
