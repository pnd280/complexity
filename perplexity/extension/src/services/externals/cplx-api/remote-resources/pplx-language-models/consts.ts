import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModelType } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export const searchModelType: LanguageModelType[] = Object.keys(
  PplxLanguageModelsService.allModels,
) as LanguageModelType[];
