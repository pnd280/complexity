import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { createAnchorSlice } from "@/plugins/__core__/slash-command/store/slices/anchor";
import { createPagesSlice } from "@/plugins/__core__/slash-command/store/slices/pages/externals";
import { createPagesStackSlice } from "@/plugins/__core__/slash-command/store/slices/pages/stack";
import { createStatesSlice } from "@/plugins/__core__/slash-command/store/slices/states";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SlashCommandMenuStoreType {}

export const slashCommandMenuStore =
  createWithEqualityFn<SlashCommandMenuStoreType>()(
    subscribeWithSelector(
      immer(
        (set, get, ...props): SlashCommandMenuStoreType => ({
          states: createStatesSlice(set, get, ...props),
          anchor: createAnchorSlice(set, get, ...props),
          externalPages: createPagesSlice(set, get, ...props),
          pagesStack: createPagesStackSlice(set, get, ...props),
        }),
      ),
    ),
  );

export const useSlashCommandMenuStore = slashCommandMenuStore;
