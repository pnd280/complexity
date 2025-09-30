import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export type InternalSearchStatesObserverStoreType = {
  sources: string[];
  selectedModel: LanguageModelCode | null;
  searchMode: LanguageModelType;
};

export const internalSearchStatesObserverStore =
  createWithEqualityFn<InternalSearchStatesObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set, get): InternalSearchStatesObserverStoreType => ({
          sources: [],
          selectedModel: null,
          searchMode: "search",
        }),
      ),
    ),
  );

export const useInternalSearchStatesObserverStore =
  internalSearchStatesObserverStore;
