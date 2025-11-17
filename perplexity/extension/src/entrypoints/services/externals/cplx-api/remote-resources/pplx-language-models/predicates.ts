import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import { searchModelType } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/consts";
import type {
  LabsLanguageModelCode,
  LanguageModel,
  LanguageModelType,
  ResearchLanguageModelCode,
  SearchLanguageModelCode,
  StudyLanguageModelCode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function isLanguageModelCode(
  value: string,
): value is LanguageModel["code"] {
  return (
    isSearchLanguageModelCode(value) ||
    isResearchLanguageModelCode(value) ||
    isLabsLanguageModelCode(value) ||
    isStudyLanguageModelCode(value)
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
  return PplxLanguageModelsService.allModels.studio.some(
    (model) => model.code === value,
  );
}

export function isStudyLanguageModelCode(
  value: string,
): value is StudyLanguageModelCode {
  return PplxLanguageModelsService.allModels.study.some(
    (model) => model.code === value,
  );
}

export function isSearchMode(value: string): value is LanguageModelType {
  return searchModelType.includes(value as LanguageModelType);
}
