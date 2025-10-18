import type { ReactNode } from "react";

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

import TablerCpu from "~icons/tabler/cpu";

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
      {models.map((model) => renderModelItem(model))}
    </GroupComp>
  );

  function renderModelItem(model: LanguageModel) {
    const Icon = PplxLanguageModelsService.icons[model.icon] ?? TablerCpu;

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
          onClick={() => {
            localStorage.setItem(
              "cplx.last-selected-language-model",
              model.code,
            );
          }}
        >
          <Icon className="x:size-4" />
          <span className="x:truncate">{model.label}</span>
        </ItemComp>
      </Tooltip>
    );
  }
}
