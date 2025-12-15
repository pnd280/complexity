import { useLocalStorage } from "@uidotdev/usehooks";

import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export default function useHiddenModels() {
  return useLocalStorage<LanguageModelCode[]>(
    "cplx.plugin:queryBox:languageModelSelector:hiddenModels",
    [],
  );
}
