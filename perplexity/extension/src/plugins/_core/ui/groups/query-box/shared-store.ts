import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type SharedQueryBoxStore = {
  spacesThreadsForceWritingMode: boolean;
  setSpacesThreadsForceWritingMode: (enable: boolean) => void;
  selectedLanguageModel: LanguageModel["code"];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel["code"],
  ) => void;
};

const useSharedQueryBoxStore = createWithEqualityFn<SharedQueryBoxStore>()(
  subscribeWithSelector(
    immer(
      (set): SharedQueryBoxStore => ({
        selectedLanguageModel: "pplx_pro",
        spacesThreadsForceWritingMode: false,
        setSelectedLanguageModel: async (selectedLanguageModel) => {
          localStorage.setItem("cplx.selected-model", selectedLanguageModel);
          set({ selectedLanguageModel });
        },
        setSpacesThreadsForceWritingMode: (forceWritingMode) => {
          set({ spacesThreadsForceWritingMode: forceWritingMode });
        },
      }),
    ),
  ),
);

const sharedQueryBoxStore = useSharedQueryBoxStore;

export { sharedQueryBoxStore, useSharedQueryBoxStore };
