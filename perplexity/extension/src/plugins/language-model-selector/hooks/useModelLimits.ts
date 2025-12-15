import { useQuery } from "@tanstack/react-query";

import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import type { PplxRateLimitsApiResponse } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";

const getLimitValue = (
  limitKeyPath: string[],
  rateLimits: PplxRateLimitsApiResponse,
): number | null => {
  const [limit, error] = tryCatch(() =>
    Number(limitKeyPath.reduce((acc, key) => (acc as any)[key], rateLimits)),
  );

  return error ? null : limit;
};

export function useModelLimits(): Record<LanguageModel["code"], number | null> {
  const { data: rateLimits } = useQuery(pplxApiQueries.rateLimits.detail());

  if (!rateLimits)
    return Object.values(PplxLanguageModelsService.allModels)
      .flat()
      .reduce(
        (acc, { code }) => ({
          ...acc,
          [code]: null,
        }),
        {} as Record<LanguageModel["code"], number | null>,
      );

  return Object.values(PplxLanguageModelsService.allModels)
    .flat()
    .reduce(
      (acc, { limitKeyPath, code }) => ({
        ...acc,
        [code]: limitKeyPath ? getLimitValue(limitKeyPath, rateLimits) : null,
      }),
      {} as Record<LanguageModel["code"], number | null>,
    );
}
