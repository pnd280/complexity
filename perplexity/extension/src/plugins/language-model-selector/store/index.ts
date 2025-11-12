import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type BetterLanguageModelSelectorStore = {
  model: LanguageModel["code"];
  setModel: (selectedLanguageModel: LanguageModel["code"]) => void;
};

export const betterLanguageModelSelectorStore =
  createWithEqualityFn<BetterLanguageModelSelectorStore>()(
    subscribeWithSelector(
      mutative(
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
