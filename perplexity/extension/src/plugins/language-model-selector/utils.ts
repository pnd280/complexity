import { pluginGuardsStore } from "@/plugins/__async-deps__/plugins-guard/store";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

function filterAndMapSelectItems(
  models: (typeof PplxLanguageModelsService.allModels)[keyof typeof PplxLanguageModelsService.allModels],
) {
  const subTier = pluginGuardsStore.getState().subTier;

  return models
    .filter((model) => !model.isMax || (model.isMax && subTier === "max"))
    .map((model) => ({
      id: model.code as LanguageModelCode,
      label: model.label,
    }));
}

export function getSelectItems() {
  const searchModels = getModelsByType("search");
  const searchFastModel = searchModels.filter((model) => !model.isReasoning);
  const searchReasoningModel = searchModels.filter(
    (model) => model.isReasoning,
  );
  const researchModels = getModelsByType("research");
  const labsModels = getModelsByType("studio");
  const advancedModels = getAdvancedStandaloneModels();

  return filterAndMapSelectItems(
    Object.values([
      searchFastModel,
      searchReasoningModel,
      researchModels,
      labsModels,
      advancedModels,
    ]).flat(),
  );
}

export function filterAndMapModels(
  models: (typeof PplxLanguageModelsService.allModels)[keyof typeof PplxLanguageModelsService.allModels],
) {
  const { subTier } = pluginGuardsStore.getState();

  return models.filter(
    (model) => !model.isMax || (model.isMax && subTier === "max"),
  );
}

export function getModelsByType(type: LanguageModelType) {
  return filterAndMapModels(PplxLanguageModelsService.allModels[type]);
}

export function getAdvancedStandaloneModels() {
  const researchAuto = structuredClone(
    PplxLanguageModelsService.allModels.research.find(
      (model) => model.code === "pplx_alpha",
    ),
  );

  const labsAuto = structuredClone(
    PplxLanguageModelsService.allModels.studio.find(
      (model) => model.code === "pplx_beta",
    ),
  );

  const studyAuto = structuredClone(
    PplxLanguageModelsService.allModels.study.find(
      (model) => model.code === "pplx_study",
    ),
  );

  if (researchAuto != null) {
    researchAuto.label = "Research";
    researchAuto.shortLabel = "Research";
    researchAuto.icon = "research";
  }

  if (labsAuto != null) {
    labsAuto.label = "Labs";
    labsAuto.shortLabel = "Labs";
    labsAuto.icon = "labs";
  }

  if (studyAuto != null) {
    studyAuto.label = "Study";
    studyAuto.shortLabel = "Study";
    studyAuto.icon = "study";
  }

  return [researchAuto, labsAuto, studyAuto].filter((model) => model != null);
}
