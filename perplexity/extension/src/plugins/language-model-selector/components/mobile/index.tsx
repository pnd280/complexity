import type { DialogProps } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePluginGuardsStore } from "@/entrypoints/contexts/content-scripts/services/ui-guard/store";
import { LanguageModelTypeIcons } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import LanguageModelGroup from "@/plugins/language-model-selector/components/mobile/LanguageModelGroup";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useFilteredModels } from "@/plugins/language-model-selector/hooks/useFilteredModels";

export default function MobileContent({ children, ...props }: DialogProps) {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { isEditMode, hiddenModels } = context;

  const subTier = usePluginGuardsStore((store) => store.subTier);

  const { allSearch, research, labs, study, advanced } = useFilteredModels(
    isEditMode,
    hiddenModels,
  );

  const renderSearchTitle = () =>
    subTier === "max" ? (
      <div className="x:flex x:items-center x:gap-1">
        <LanguageModelTypeIcons.search className="x:size-4" />
        <span>Search</span>
      </div>
    ) : (
      <span>Standard</span>
    );

  const renderResearchTitle = () => (
    <div className="x:flex x:items-center x:gap-1">
      <LanguageModelTypeIcons.research className="x:size-4" />
      <span>Research</span>
    </div>
  );

  const renderLabsTitle = () => (
    <div className="x:flex x:items-center x:gap-1">
      <LanguageModelTypeIcons.studio className="x:size-4" />
      <span>Labs</span>
    </div>
  );

  const renderStudyTitle = () => (
    <div className="x:flex x:items-center x:gap-1">
      <LanguageModelTypeIcons.study className="x:size-4" />
      <span>Study</span>
    </div>
  );

  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent
        side="bottom"
        closeButton={false}
        className="x:flex x:flex-col x:gap-2"
      >
        {children}
        <LanguageModelGroup title={renderSearchTitle()} models={allSearch} />

        {subTier === "pro" && (
          <LanguageModelGroup title={<span>Advanced</span>} models={advanced} />
        )}

        {subTier === "max" && (
          <>
            <LanguageModelGroup
              title={renderResearchTitle()}
              models={research}
            />
            <LanguageModelGroup title={renderLabsTitle()} models={labs} />
            <LanguageModelGroup title={renderStudyTitle()} models={study} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
