import type { CommandMenuStoreType } from "@/plugins/command-menu/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/command-menu/store" {
  interface CommandMenuStoreType {
    states: StatesSlice;
  }
}

export type StatesSlice = {
  open: boolean;
  setOpen: (value: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectingValue: string;
  setSelectingValue: (value: string) => void;
  shouldLocalFilter: boolean;
  setShouldLocalFilter: (value: boolean) => void;
};

export const createStatesSlice: SliceCreator<
  StatesSlice,
  CommandMenuStoreType
> = (set) => ({
  open: false,
  setOpen: (value) =>
    set((draft) => {
      draft.states.open = value;
    }),
  searchValue: "",
  setSearchValue: (value) =>
    set((draft) => {
      draft.states.searchValue = value;
    }),
  selectingValue: "",
  setSelectingValue: (value) =>
    set((draft) => {
      draft.states.selectingValue = value;
    }),
  shouldLocalFilter: true,
  setShouldLocalFilter: (value) =>
    set((draft) => {
      draft.states.shouldLocalFilter = value;
    }),
});
