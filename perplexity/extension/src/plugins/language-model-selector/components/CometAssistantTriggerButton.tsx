import Tooltip from "@/components/Tooltip";
import { useBetterLanguageModelSelectorStore } from "@/plugins/language-model-selector/store";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";

import TablerCpu from "~icons/tabler/cpu";

export default function CometAssistantLanguageModelSelectorTriggerButton() {
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

  const isAuto = modelInfo?.label.toLowerCase().includes("auto");

  return (
    <Tooltip
      content={<span className="x:truncate">{modelInfo?.shortLabel}</span>}
    >
      <div
        className={cn(
          "x:flex x:h-8 x:items-center x:justify-center x:gap-2 x:rounded-lg x:px-2.5 x:text-sm x:font-medium x:text-muted-foreground x:transition-all x:hover:bg-primary-foreground",
          {
            "x:text-primary": !isAuto,
            "x:hover:text-foreground": isAuto,
          },
        )}
      >
        <TablerCpu className="x:size-4 x:shrink-0" />
      </div>
    </Tooltip>
  );
}
