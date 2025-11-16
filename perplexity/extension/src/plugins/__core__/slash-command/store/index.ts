import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import { createAnchorSlice } from "@/plugins/__core__/slash-command/store/slices/anchor";
import { createPagesStackSlice } from "@/plugins/__core__/slash-command/store/slices/pages/stack";
import { createStatesSlice } from "@/plugins/__core__/slash-command/store/slices/states";

export interface SlashCommandMenuStoreType {}

export const slashCommandMenuStore =
  createWithEqualityFn<SlashCommandMenuStoreType>()(
    subscribeWithSelector(
      mutative(
        (set, get, ...props): SlashCommandMenuStoreType => ({
          states: createStatesSlice(set, get, ...props),
          anchor: createAnchorSlice(set, get, ...props),
          pagesStack: createPagesStackSlice(set, get, ...props),
        }),
      ),
    ),
  );

export const useSlashCommandMenuStore = slashCommandMenuStore;
