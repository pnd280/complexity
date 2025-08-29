import type { ReactNode } from "react";
import { LuCpu } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

type LanguageModelGroupProps = {
  title: ReactNode;
  models: LanguageModel[];
  tooltipPlacement?: "left" | "right";
  titleTooltip?: ReactNode;
};

export default function LanguageModelGroup({
  title,
  models,
  tooltipPlacement = "left",
  titleTooltip,
}: LanguageModelGroupProps) {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { component } = context;

  const GroupComp = component === "dropdown" ? DropdownMenuGroup : SelectGroup;
  const ItemComp = component === "dropdown" ? DropdownMenuItem : SelectItem;
  const LabelComp = component === "dropdown" ? DropdownMenuLabel : SelectLabel;

  const modelsLimits = useModelLimits();

  if (models.length === 0) return null;

  const reasoningModels = models.filter((model) => model.isReasoning);
  const fastModels = models.filter((model) => !model.isReasoning);

  const showDivider = reasoningModels.length > 0 && fastModels.length > 0;

  return (
    <GroupComp className="x:m-0 x:p-0">
      {titleTooltip != null ? (
        <Tooltip
          content={titleTooltip}
          positioning={{
            placement: "right",
          }}
        >
          <LabelComp className="x:font-mono x:whitespace-nowrap x:uppercase">
            {title}
          </LabelComp>
        </Tooltip>
      ) : (
        <LabelComp className="x:flex x:items-center x:gap-1 x:font-mono x:whitespace-nowrap x:uppercase">
          {title}
        </LabelComp>
      )}

      {fastModels.map((model) => renderModelItem(model))}

      {showDivider && (
        <div className="x:mx-2 x:my-2 x:flex x:items-center x:gap-2 x:text-xs x:text-muted-foreground">
          <div>Reasoning</div>
          <div className="x:h-[0.5px] x:w-full x:bg-border/75" />
        </div>
      )}

      {reasoningModels.map((model) => renderModelItem(model))}
    </GroupComp>
  );

  function renderModelItem(model: LanguageModel) {
    const Icon = PplxLanguageModelsService.icons[model.icon] ?? LuCpu;

    const modelLimit = modelsLimits[model.code as keyof typeof modelsLimits];
    const limit =
      modelLimit === Infinity
        ? t("plugin-model-selectors.languageModelSelector.usesLeft.unlimited")
        : typeof modelLimit === "number"
          ? t("plugin-model-selectors.languageModelSelector.usesLeft.limited", {
              count: modelLimit,
            })
          : "";

    const tooltipContent = limit;

    return (
      <Tooltip
        key={model.code}
        content={
          <div className="x:max-w-48 x:text-pretty">{tooltipContent}</div>
        }
        disabled={modelsLimits[model.code as keyof typeof modelsLimits] == null}
        positioning={{ placement: tooltipPlacement, gutter: 10 }}
      >
        <ItemComp
          key={model.code}
          item={model.code}
          value={model.code}
          className="x:flex x:cursor-pointer x:items-center x:justify-start x:gap-2 x:text-foreground"
        >
          <Icon className="x:size-4" />
          <span className="x:truncate">{model.label}</span>
        </ItemComp>
      </Tooltip>
    );
  }
}
