import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type {
  LabsLanguageModelCode,
  LanguageModel,
  ResearchLanguageModelCode,
  SearchLanguageModelCode,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function isLanguageModelCode(
  value: string,
): value is LanguageModel["code"] {
  return (
    isSearchLanguageModelCode(value) ||
    isResearchLanguageModelCode(value) ||
    isLabsLanguageModelCode(value)
  );
}

export function isSearchLanguageModelCode(
  value: string,
): value is SearchLanguageModelCode {
  return PplxLanguageModelsService.allModels.search.some(
    (model) => model.code === value,
  );
}

export function isResearchLanguageModelCode(
  value: string,
): value is ResearchLanguageModelCode {
  return PplxLanguageModelsService.allModels.research.some(
    (model) => model.code === value,
  );
}

export function isLabsLanguageModelCode(
  value: string,
): value is LabsLanguageModelCode {
  return PplxLanguageModelsService.allModels.labs.some(
    (model) => model.code === value,
  );
}
