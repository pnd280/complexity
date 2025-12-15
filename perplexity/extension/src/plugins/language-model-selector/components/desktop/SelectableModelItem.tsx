import Tooltip from "@/components/Tooltip";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { ModelItemContent } from "@/plugins/language-model-selector/components/desktop/ModelItemContent";
import { getItemClassName } from "@/plugins/language-model-selector/components/desktop/utils";
import { useSelectorUi } from "@/plugins/language-model-selector/hooks/useSelectorUi";
import type { TooltipPlacement } from "@/plugins/language-model-selector/types";

type SelectableModelItemProps = {
  model: LanguageModel;
  isHidden: boolean;
  modelLimitText: string;
  isLimitDisabled: boolean;
  tooltipPlacement: TooltipPlacement;
};

export function SelectableModelItem({
  model,
  isHidden,
  modelLimitText,
  isLimitDisabled,
  tooltipPlacement,
}: SelectableModelItemProps) {
  const { Item: SelectableItemComponent } = useSelectorUi();

  return (
    <Tooltip
      content={<div className="x:max-w-48 x:text-pretty">{modelLimitText}</div>}
      disabled={isLimitDisabled}
      positioning={{ placement: tooltipPlacement, gutter: 10 }}
    >
      <SelectableItemComponent
        item={model.code}
        value={model.code}
        className={getItemClassName(
          isHidden,
          "x:flex x:cursor-pointer x:items-center x:justify-start x:gap-2 x:text-foreground",
        )}
        onClick={() => {
          localStorage.setItem("cplx:lastSelectedLanguageModel", model.code);
        }}
      >
        <ModelItemContent
          model={model}
          isHidden={isHidden}
          isEditMode={false}
        />
      </SelectableItemComponent>
    </Tooltip>
  );
}
