import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type LanguageModelSelectorContext = {
  component: "select" | "dropdown";
  setHighlightedItem: (item: LanguageModelCode) => void;
};

export const LanguageModelSelectorContext =
  createContext<LanguageModelSelectorContext | null>(null);
