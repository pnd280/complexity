import type {
  LanguageModel,
  LanguageModelCode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { ModelItemContent } from "@/plugins/language-model-selector/components/desktop/ModelItemContent";
import { getItemClassName } from "@/plugins/language-model-selector/components/desktop/utils";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

type EditableModelItemProps = {
  model: LanguageModel;
  isHidden: boolean;
};

export function EditableModelItem({ model, isHidden }: EditableModelItemProps) {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { toggleModelVisibility } = context;

  return (
    <div
      className={getItemClassName(
        isHidden,
        "x:group/item x:flex x:cursor-pointer x:items-center x:justify-start x:gap-2 x:rounded-md x:px-2 x:py-1.5 x:text-sm x:text-foreground x:transition-colors",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleModelVisibility(model.code as LanguageModelCode);
      }}
    >
      <ModelItemContent isEditMode model={model} isHidden={isHidden} />
    </div>
  );
}
