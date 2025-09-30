import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { createAnchorSlice } from "@/plugins/__core__/slash-command/store/slices/anchor";
import { createPagesStackSlice } from "@/plugins/__core__/slash-command/store/slices/pages";
import { createStatesSlice } from "@/plugins/__core__/slash-command/store/slices/states";
import type { SlashCommandMenuStoreType } from "@/plugins/__core__/slash-command/store/types";

export const slashCommandMenuStore =
  createWithEqualityFn<SlashCommandMenuStoreType>()(
    subscribeWithSelector(
      immer(
        (set, get, ...props): SlashCommandMenuStoreType => ({
          ...createStatesSlice(set, get, ...props),
          ...createAnchorSlice(set, get, ...props),
          ...createPagesStackSlice(set, get, ...props),
        }),
      ),
    ),
  );

export const useSlashCommandMenuStore = slashCommandMenuStore;
