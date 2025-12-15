import type {
  LanguageModel,
  LanguageModelCode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { EditableModelItem } from "@/plugins/language-model-selector/components/desktop/EditableModelItem";
import { SelectableModelItem } from "@/plugins/language-model-selector/components/desktop/SelectableModelItem";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import type {
  ModelLimits,
  TooltipPlacement,
} from "@/plugins/language-model-selector/types";

type ModelItemProps = {
  model: LanguageModel;
  modelsLimits: ModelLimits;
  tooltipPlacement: TooltipPlacement;
};

export function ModelItem({
  model,
  modelsLimits,
  tooltipPlacement,
}: ModelItemProps) {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { isEditMode, hiddenModels } = context;
  const isHidden = hiddenModels.includes(model.code as LanguageModelCode);
  const modelLimitText = useModelTooltipContent(model, modelsLimits);
  const isLimitDisabled =
    modelsLimits[model.code as keyof typeof modelsLimits] == null;

  return isEditMode ? (
    <EditableModelItem model={model} isHidden={isHidden} />
  ) : (
    <SelectableModelItem
      model={model}
      isHidden={isHidden}
      modelLimitText={modelLimitText}
      isLimitDisabled={isLimitDisabled}
      tooltipPlacement={tooltipPlacement}
    />
  );
}

function useModelTooltipContent(
  model: LanguageModel,
  modelsLimits: ModelLimits,
) {
  const modelLimit = modelsLimits[model.code as keyof typeof modelsLimits];
  return modelLimit === Infinity
    ? t("plugin-model-selectors.languageModelSelector.usesLeft.unlimited")
    : typeof modelLimit === "number"
      ? t("plugin-model-selectors.languageModelSelector.usesLeft.limited", {
          count: modelLimit,
        })
      : "";
}
