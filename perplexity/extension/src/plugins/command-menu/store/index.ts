import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import { createFooterSlice } from "@/plugins/command-menu/store/slices/footer";
import { createPagesStackSlice } from "@/plugins/command-menu/store/slices/pages/stack";
import { createSidecarSlice } from "@/plugins/command-menu/store/slices/sidecar";
import { createStatesSlice } from "@/plugins/command-menu/store/slices/states";

export interface CommandMenuStoreType {}

export const commandMenuStore = createWithEqualityFn<CommandMenuStoreType>()(
  subscribeWithSelector(
    mutative((set, get, ...props) => ({
      pagesStack: createPagesStackSlice(set, get, ...props),
      states: createStatesSlice(set, get, ...props),
      footer: createFooterSlice(set, get, ...props),
      sidecar: createSidecarSlice(set, get, ...props),
    })),
  ),
);

export const useCommandMenuStore = commandMenuStore;
