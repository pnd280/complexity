import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import {
  getAdvancedStandaloneModels,
  getModelsByType,
} from "@/plugins/language-model-selector/utils";

type FilteredModels = {
  allSearch: LanguageModel[];
  standard: LanguageModel[];
  reasoning: LanguageModel[];
  research: LanguageModel[];
  labs: LanguageModel[];
  study: LanguageModel[];
  advanced: LanguageModel[];
};

/**
 * Hook to filter models based on edit mode and hidden models.
 * Returns all model buckets for flexible consumption by different components.
 */
export function useFilteredModels(
  isEditMode: boolean,
  hiddenModels: string[],
): FilteredModels {
  const searchModels = getModelsByType("search");
  let allSearch = searchModels;
  let standard = searchModels.filter((model) => !model.isReasoning);
  let reasoning = searchModels.filter((model) => model.isReasoning);
  let research = getModelsByType("research");
  let labs = getModelsByType("studio");
  let study = getModelsByType("study");
  let advanced = getAdvancedStandaloneModels();

  // Apply hidden model filter only in non-edit mode
  if (!isEditMode) {
    const filterFn = (model: { code: string }) =>
      !hiddenModels.includes(model.code);
    allSearch = allSearch.filter(filterFn);
    standard = standard.filter(filterFn);
    reasoning = reasoning.filter(filterFn);
    research = research.filter(filterFn);
    labs = labs.filter(filterFn);
    study = study.filter(filterFn);
    advanced = advanced.filter(filterFn);
  }

  return {
    allSearch,
    standard,
    reasoning,
    research,
    labs,
    study,
    advanced,
  };
}
