import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

import TablerCpu from "~icons/tabler/cpu";
import TablerEyeOff from "~icons/tabler/eye-off";

type ModelItemContentProps = {
  model: LanguageModel;
  isHidden: boolean;
  isEditMode: boolean;
};

export function ModelItemContent({
  model,
  isHidden,
  isEditMode,
}: ModelItemContentProps) {
  return (
    <>
      {renderModelIconByType(model.icon)}
      <span className="x:flex-1 x:truncate">{model.label}</span>
      {isEditMode && (
        <div className="x:pointer-events-none x:z-10 x:flex x:h-5 x:w-5 x:items-center x:justify-center">
          {isHidden && (
            <TablerEyeOff className="x:size-4 x:animate-in x:fade-in" />
          )}
        </div>
      )}
    </>
  );
}

function renderModelIconByType(iconType: string) {
  const Icon = PplxLanguageModelsService.icons[iconType] ?? TablerCpu;
  return <Icon className="x:size-4" />;
}
