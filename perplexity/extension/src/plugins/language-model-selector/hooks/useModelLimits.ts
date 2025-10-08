import { useImmer } from "use-immer";

import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function useModelLimits() {
  const { data } = usePplxUserSettings();

  const getModelLimit = useCallback(
    (model: LanguageModel): number | null => {
      const limitKey = model.limitKey;
      if (!limitKey) return null;
      return Number(data?.[limitKey as keyof typeof data]);
    },
    [data],
  );

  const [modelsLimits, setModelsLimits] = useImmer<
    Partial<Record<LanguageModel["code"], number | null>>
  >({});

  useEffect(() => {
    setModelsLimits((draft) => {
      Object.values(PplxLanguageModelsService.allModels)
        .flat()
        .forEach((model) => {
          draft[model.code] = getModelLimit(model);
        });
    });
  }, [data, getModelLimit, setModelsLimits]);

  return modelsLimits;
}
