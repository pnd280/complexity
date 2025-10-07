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
    (state) => state.selectedLanguageModel,
  );

  const modelInfo = useMemo(
    () =>
      Object.values(PplxLanguageModelsService.allModels)
        .flat()
        .find((m) => m.code === selectedLanguageModel),
    [selectedLanguageModel],
  );

  const type = useMemo(
    () =>
      Object.entries(PplxLanguageModelsService.allModels).find(([_, models]) =>
        models.some((m) => m.code === selectedLanguageModel),
      )?.[0],
    [selectedLanguageModel],
  );

  const TypeIcon = useMemo(
    () =>
      type ? LanguageModelTypeIcons[type as LanguageModelType] : TablerCpu,
    [type],
  );

  const isAuto = modelInfo?.label.toLowerCase().includes("auto");

  return (
    <Tooltip
      content={t("plugin-model-selectors.languageModelSelector.tooltip")}
    >
      <div
        className={cn(
          "x:flex x:h-8 x:items-center x:justify-center x:gap-2 x:rounded-lg x:border x:border-border/50 x:bg-primary-foreground x:px-2.5 x:text-sm x:font-medium x:text-foreground x:transition-all",
        )}
      >
        <TypeIcon className="x:size-4 x:shrink-0" />
        <Separator orientation="vertical" className="x:h-4 x:w-px" />
        <span className="x:truncate">
          {isAuto
            ? type
              ? (advancedModeLabelMap[type as LanguageModelType] ??
                `${type.charAt(0).toUpperCase()}${type.slice(1)}`)
              : modelInfo?.shortLabel
            : modelInfo?.shortLabel}
        </span>
      </div>
    </Tooltip>
  );
}
