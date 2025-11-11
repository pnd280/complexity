import type { SlashCommandMenuStoreType } from "@/plugins/__core__/slash-command/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/__core__/slash-command/store" {
  interface SlashCommandMenuStoreType {
    externalPages: ExternalPagesSlice;
  }
}

export type ExternalPagesSlice = {
  pages: React.ReactElement[];
  addPage: (page: React.ReactElement) => void;
  removePage: (page: React.ReactElement) => void;
};

export const createPagesSlice: SliceCreator<
  ExternalPagesSlice,
  SlashCommandMenuStoreType
> = (set) => ({
  pages: [],
  addPage: (page) => {
    set((draft) => {
      draft.externalPages.pages.push(page);
    });
  },
  removePage: (page) => {
    set((draft) => {
      draft.externalPages.pages = draft.externalPages.pages.filter(
        (p) => p !== page,
      );
    });
  },
});
