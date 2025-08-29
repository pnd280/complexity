import type { DialogProps } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import LanguageModelGroup from "@/plugins/language-model-selector/components/mobile/LanguageModelGroup";
import { getAdvancedStandaloneModels } from "@/plugins/language-model-selector/utils";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import { languageModelTypeIcons } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/icons";

export default function MobileContent({ ...props }: DialogProps) {
  const subTier = usePluginGuardsStore((store) => store.subTier);

  const searchModels = useMemo(
    () => PplxLanguageModelsService.allModels.search,
    [],
  );
  const researchModels = useMemo(
    () => PplxLanguageModelsService.allModels.research,
    [],
  );
  const labsModels = useMemo(
    () => PplxLanguageModelsService.allModels.labs,
    [],
  );
  const advancedModels = useMemo(() => getAdvancedStandaloneModels(), []);

  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent
        side="bottom"
        closeButton={false}
        className="x:flex x:flex-col x:gap-2"
      >
        <LanguageModelGroup
          title={
            subTier === "max" ? (
              <div className="x:flex x:items-center x:gap-1">
                <languageModelTypeIcons.search className="x:size-4" />
                <span>Search</span>
              </div>
            ) : (
              <span>Standard</span>
            )
          }
          models={searchModels}
        />
        {subTier === "max" && (
          <>
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <languageModelTypeIcons.research className="x:size-4" />
                  <span>Research</span>
                </div>
              }
              models={researchModels}
            />
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <languageModelTypeIcons.labs className="x:size-4" />
                  <span>Labs</span>
                </div>
              }
              models={labsModels}
            />
          </>
        )}

        {subTier === "pro" && (
          <LanguageModelGroup
            title={<span>Advanced</span>}
            models={advancedModels}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
