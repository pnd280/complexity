import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { createFooterSlice } from "@/plugins/command-menu/store/slices/footer";
import { createPagesStackSlice } from "@/plugins/command-menu/store/slices/pages";
import { createSidecarSlice } from "@/plugins/command-menu/store/slices/sidecar";
import { createStatesSlice } from "@/plugins/command-menu/store/slices/states";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CommandMenuStoreType {}

export const commandMenuStore = createWithEqualityFn<CommandMenuStoreType>()(
  subscribeWithSelector(
    immer((set, get, ...props) => ({
      states: createStatesSlice(set, get, ...props),
      pagesStack: createPagesStackSlice(set, get, ...props),
      footer: createFooterSlice(set, get, ...props),
      sidecar: createSidecarSlice(set, get, ...props),
    })),
  ),
);

export const useCommandMenuStore = commandMenuStore;
