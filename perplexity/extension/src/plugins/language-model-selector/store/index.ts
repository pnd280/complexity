import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type BetterLanguageModelSelectorStore = {
  model: LanguageModel["code"];
  setModel: (selectedLanguageModel: LanguageModel["code"]) => void;
};

export const betterLanguageModelSelectorStore =
  createWithEqualityFn<BetterLanguageModelSelectorStore>()(
    subscribeWithSelector(
      immer(
        (set): BetterLanguageModelSelectorStore => ({
          model: "pplx_pro",
          setModel: (selectedLanguageModel) => {
            set({ model: selectedLanguageModel });
          },
        }),
      ),
    ),
  );

export const useBetterLanguageModelSelectorStore =
  betterLanguageModelSelectorStore;
