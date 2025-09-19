import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { QueryBoxType } from "@/plugins/_core/ui/groups/query-box/types";

export type ScopedQueryBoxStoreType = {
  type: QueryBoxType;
};

export const createQueryBoxScopedStore = (
  initialState: ScopedQueryBoxStoreType,
) =>
  createWithEqualityFn<ScopedQueryBoxStoreType>()(
    subscribeWithSelector(
      immer(
        (set): ScopedQueryBoxStoreType => ({
          ...initialState,
        }),
      ),
    ),
  );
