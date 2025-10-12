import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { DomObserversMainWorldActions } from "@/plugins/__core__/dom-observers/_main-world";
import {
  remoteInternalSearchStatesStatesFiberPathStr,
  remoteInternalSearchStatesValidateFiberPathStr,
} from "@/plugins/__core__/dom-observers/internal-search-states/remote-resources/fetched-resources";
import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export type SearchStates = {
  sources: string[];
  model: LanguageModelCode | null;
  searchMode: LanguageModelType;
};

export type InternalSearchStatesObserverStoreType = SearchStates & {
  setInternalSearchStates: (state: Partial<SearchStates>) => void;
};

export const internalSearchStatesObserverStore =
  createWithEqualityFn<InternalSearchStatesObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (): InternalSearchStatesObserverStoreType => ({
          sources: [],
          model: null,
          searchMode: "search",
          setInternalSearchStates(state) {
            void DomObserversMainWorldActions.Instance.setInternalSearchStates({
              states: {
                model: state.model,
                searchMode: state.searchMode,
                sources: state.sources,
              },
              remoteValidationFiberPath:
                remoteInternalSearchStatesValidateFiberPathStr.split("."),
              remoteStatesFiberPath:
                remoteInternalSearchStatesStatesFiberPathStr.split("."),
            });
          },
        }),
      ),
    ),
  );

export const useInternalSearchStatesObserverStore =
  internalSearchStatesObserverStore;
