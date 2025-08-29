import { pluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
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
  return filterAndMapSelectItems(
    Object.values(PplxLanguageModelsService.allModels).flat(),
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
    PplxLanguageModelsService.allModels.labs.find(
      (model) => model.code === "pplx_beta",
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

  return [researchAuto, labsAuto].filter((model) => model != null);
}
