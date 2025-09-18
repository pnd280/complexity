import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type BetterLanguageModelSelectorStore = {
  selectedLanguageModel: LanguageModel["code"];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel["code"],
  ) => void;
};

export const betterLanguageModelSelectorStore =
  createWithEqualityFn<BetterLanguageModelSelectorStore>()(
    subscribeWithSelector(
      immer(
        (set): BetterLanguageModelSelectorStore => ({
          selectedLanguageModel: "pplx_pro",
          setSelectedLanguageModel: (selectedLanguageModel) => {
            set({ selectedLanguageModel });
          },
        }),
      ),
    ),
  );

export const useBetterLanguageModelSelectorStore =
  betterLanguageModelSelectorStore;
