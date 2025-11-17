import type { DialogProps } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePluginGuardsStore } from "@/entrypoints/contexts/content-scripts/services/ui-guard/store";
import { LanguageModelTypeIcons } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import LanguageModelGroup from "@/plugins/language-model-selector/components/mobile/LanguageModelGroup";
import {
  getAdvancedStandaloneModels,
  getModelsByType,
} from "@/plugins/language-model-selector/utils";

export default function MobileContent({ children, ...props }: DialogProps) {
  const subTier = usePluginGuardsStore((store) => store.subTier);

  const searchModels = getModelsByType("search");
  const researchModels = getModelsByType("research");
  const labsModels = getModelsByType("studio");
  const studyModels = getModelsByType("study");
  const advancedModels = getAdvancedStandaloneModels();

  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent
        side="bottom"
        closeButton={false}
        className="x:flex x:flex-col x:gap-2"
      >
        {children}
        <LanguageModelGroup
          title={
            subTier === "max" ? (
              <div className="x:flex x:items-center x:gap-1">
                <LanguageModelTypeIcons.search className="x:size-4" />
                <span>Search</span>
              </div>
            ) : (
              <span>Standard</span>
            )
          }
          models={searchModels}
        />

        {subTier === "pro" && (
          <LanguageModelGroup
            title={<span>Advanced</span>}
            models={advancedModels}
          />
        )}

        {subTier === "max" && (
          <>
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <LanguageModelTypeIcons.research className="x:size-4" />
                  <span>Research</span>
                </div>
              }
              models={researchModels}
            />
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <LanguageModelTypeIcons.studio className="x:size-4" />
                  <span>Labs</span>
                </div>
              }
              models={labsModels}
            />
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <LanguageModelTypeIcons.study className="x:size-4" />
                  <span>Study</span>
                </div>
              }
              models={studyModels}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
