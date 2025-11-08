import type { SlashCommandMenuStoreType } from "@/plugins/__core__/slash-command/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/__core__/slash-command/store" {
  interface SlashCommandMenuStoreType {
    states: StatesSlice;
  }
}

export type StatesSlice = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const createStatesSlice: SliceCreator<
  StatesSlice,
  SlashCommandMenuStoreType
> = (set) => ({
  open: false,
  setOpen: (open) => {
    // hacky solution to prevent the popover from briefly stays at 0,0 on open
    setTimeout(() => {
      set((draft) => {
        draft.states.open = open;
      });
    }, 10);
  },
});
