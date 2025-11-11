import Tooltip from "@/components/Tooltip";
import { Separator } from "@/components/ui/separator";
import { useBetterLanguageModelSelectorStore } from "@/plugins/language-model-selector/store";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import { LanguageModelTypeIcons } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import type { LanguageModelType } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

import TablerCpu from "~icons/tabler/cpu";

const advancedModeLabelMap: Record<LanguageModelType, string> = {
  search: "Search",
  research: "Research",
  studio: "Labs",
  study: "Study",
};

export default function BetterLanguageModelSelectorTriggerButton() {
  const selectedLanguageModel = useBetterLanguageModelSelectorStore(
    (store) => store.model,
  );

  const modelInfo = Object.values(PplxLanguageModelsService.allModels)
    .flat()
    .find((m) => m.code === selectedLanguageModel);

  const type = Object.entries(PplxLanguageModelsService.allModels).find(
    ([_, models]) => models.some((m) => m.code === selectedLanguageModel),
  )?.[0] as LanguageModelType | undefined;

  const TypeIcon = type
    ? LanguageModelTypeIcons[type as LanguageModelType]
    : TablerCpu;

  const isAuto = modelInfo?.label.toLowerCase().includes("auto");

  return (
    <Tooltip
      content={t("plugin-model-selectors.languageModelSelector.tooltip")}
    >
      <div
        className={cn(
          "x:flex x:h-8 x:items-center x:justify-center x:gap-2 x:rounded-lg x:border x:border-border/50 x:bg-primary/10 x:px-2.5 x:text-sm x:font-medium x:text-foreground x:transition-all x:md:bg-foreground-subtle",
        )}
      >
        <TypeIcon className="x:size-4 x:shrink-0 x:text-primary x:md:text-foreground" />
        <Separator
          orientation="vertical"
          className="x:hidden x:h-4 x:w-px x:md:block"
        />
        <span className="x:hidden x:truncate x:md:block">
          {isAuto
            ? type
              ? advancedModeLabelMap[type]
              : modelInfo?.shortLabel
            : modelInfo?.shortLabel}
        </span>
      </div>
    </Tooltip>
  );
}
