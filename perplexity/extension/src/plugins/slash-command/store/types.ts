import type { StateCreator } from "zustand/vanilla";

import type { slashCommandMenuStore } from "@/plugins/slash-command/store";
import type { AnchorSlice } from "@/plugins/slash-command/store/slices/anchor";
import type { PagesStackSlice } from "@/plugins/slash-command/store/slices/pages";
import type { StatesSlice } from "@/plugins/slash-command/store/slices/states";

export type SlashCommandMenuStore = typeof slashCommandMenuStore;

export type SlashCommandMenuStoreType = StatesSlice &
  AnchorSlice &
  PagesStackSlice;

export type BoundStateCreator<T> = StateCreator<
  SlashCommandMenuStoreType,
  [["zustand/subscribeWithSelector", never], ["zustand/immer", never]],
  [],
  T
>;
