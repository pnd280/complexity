import type { CommandMenuStoreType } from "@/plugins/command-menu/store";
import type { SliceCreator } from "@/types/utils.types";

declare module "@/plugins/command-menu/store" {
  interface CommandMenuStoreType {
    sidecar: SidecarSlice;
  }
}

export type SidecarSlice = {
  open: boolean;
  setOpen: (open: boolean) => void;
  items: React.ReactNode | null;
  setItems: (items: React.ReactNode | null) => void;
};

export const createSidecarSlice: SliceCreator<
  SidecarSlice,
  CommandMenuStoreType
> = (set) => ({
  open: false,
  setOpen: (open) =>
    set((draft) => {
      draft.sidecar.open = open;
    }),
  items: null,
  setItems: (items) =>
    set((draft) => {
      draft.sidecar.items = items;
    }),
});
