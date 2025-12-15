import Tooltip from "@/components/Tooltip";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { ModelItem } from "@/plugins/language-model-selector/components/desktop/ModelItem";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";
import { useSelectorUi } from "@/plugins/language-model-selector/hooks/useSelectorUi";
import type { LanguageModelGroupProps } from "@/plugins/language-model-selector/types";

export default function LanguageModelGroup({
  title,
  models,
  tooltipPlacement = "left",
  titleTooltip,
}: LanguageModelGroupProps) {
  const { Group: GroupComponent, Label: LabelComponent } = useSelectorUi();
  const modelsLimits = useModelLimits();

  if (models.length === 0) return null;

  return (
    <GroupComponent className="x:m-0 x:p-0">
      {titleTooltip != null ? (
        <Tooltip
          content={titleTooltip}
          positioning={{
            placement: "right",
          }}
        >
          <LabelComponent className="x:font-mono x:whitespace-nowrap x:uppercase">
            {title}
          </LabelComponent>
        </Tooltip>
      ) : (
        <LabelComponent className="x:flex x:items-center x:gap-1 x:font-mono x:whitespace-nowrap x:uppercase">
          {title}
        </LabelComponent>
      )}
      {models.map((model) => (
        <ModelItem
          key={model.code}
          model={model}
          modelsLimits={modelsLimits}
          tooltipPlacement={tooltipPlacement}
        />
      ))}
    </GroupComponent>
  );
}
