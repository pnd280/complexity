import type { CommandMenuStoreType } from "@/plugins/command-menu/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/command-menu/store" {
  interface CommandMenuStoreType {
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
  CommandMenuStoreType
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
