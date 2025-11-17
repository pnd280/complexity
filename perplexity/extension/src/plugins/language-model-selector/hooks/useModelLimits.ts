import usePplxUserSettings from "@/entrypoints/hooks/usePplxUserSettings";
import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function useModelLimits() {
  const { data } = usePplxUserSettings();

  const limits: Partial<Record<LanguageModel["code"], number | null>> = {};

  Object.values(PplxLanguageModelsService.allModels)
    .flat()
    .forEach((model) => {
      const limitKey = model.limitKey;
      if (!limitKey) {
        limits[model.code] = null;
      } else {
        limits[model.code] = Number(data?.[limitKey as keyof typeof data]);
      }
    });

  return limits;
}
