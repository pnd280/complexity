import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";

import TablerCpu from "~icons/tabler/cpu";

type MobileLanguageModelGroupProps = {
  title: React.ReactNode;
  models: LanguageModel[];
};

export default function MobileLanguageModelGroup({
  title,
  models,
}: MobileLanguageModelGroupProps) {
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
