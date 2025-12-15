import type { ReactNode } from "react";

import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";
import { useSelectorUi } from "@/plugins/language-model-selector/hooks/useSelectorUi";

import TablerCpu from "~icons/tabler/cpu";

type MobileLanguageModelGroupProps = {
  title: ReactNode;
  models: LanguageModel[];
};

export default function MobileLanguageModelGroup({
  title,
  models,
}: MobileLanguageModelGroupProps) {
  const {
    Group: GroupComp,
    Label: LabelComp,
    Item: ItemComp,
  } = useSelectorUi();
  const modelsLimits = useModelLimits();

  if (models.length === 0) return null;

  return (
    <GroupComp className="x:m-0 x:p-0">
      <div className="x:flex x:items-center x:justify-between x:gap-2">
        <LabelComp className="x:font-mono x:text-base x:whitespace-nowrap x:uppercase">
          {title}
        </LabelComp>
        <div className="x:h-px x:w-full x:bg-border/75" />
      </div>
      {models.map((model) => {
        const Icon = PplxLanguageModelsService.icons[model.icon] ?? TablerCpu;

        const modelLimit =
          modelsLimits[model.code as keyof typeof modelsLimits];
        const limit =
          modelLimit === Infinity
            ? t(
                "plugin-model-selectors.languageModelSelector.usesLeft.unlimited",
              )
            : typeof modelLimit === "number"
              ? t(
                  "plugin-model-selectors.languageModelSelector.usesLeft.limited",
                  { count: modelLimit },
                )
              : "";

        const tooltipContent = limit;

        return (
          <ItemComp
            key={model.code}
            item={model.code}
            value={model.code}
            className="x:gap-2 x:p-4 x:text-base"
            onClick={() => {
              localStorage.setItem(
                "cplx:lastSelectedLanguageModel",
                model.code,
              );
            }}
          >
            <div className="x:flex x:w-full x:items-center x:justify-between x:gap-2">
              <div className="x:flex x:items-center x:gap-2">
                <Icon className="x:size-4" />
                <span className="x:truncate">{model.label}</span>
              </div>
              <div className="x:text-xs x:text-muted-foreground">
                {tooltipContent}
              </div>
            </div>
          </ItemComp>
        );
      })}
    </GroupComp>
  );
}
