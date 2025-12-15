import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SelectContent } from "@/components/ui/select";
import { usePluginGuardsStore } from "@/entrypoints/contexts/content-scripts/services/ui-guard/store";
import { ScopedQueryBoxContext } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/context";
import { LanguageModelTypeIcons } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import LanguageModelGroup from "@/plugins/language-model-selector/components/desktop/LanguageModelGroup";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useFilteredModels } from "@/plugins/language-model-selector/hooks/useFilteredModels";

export default function DesktopContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { type, isEditMode, hiddenModels } = context;

  const ContentComponent =
    type === "rewrite" ? DropdownMenuContent : SelectContent;

  const subTier = usePluginGuardsStore((store) => store.subTier);

  const isCometAssistant =
    use(ScopedQueryBoxContext)?.store.type === "comet-assistant";

  const { standard, reasoning, research, labs, study, advanced } =
    useFilteredModels(isEditMode, hiddenModels);

  const renderStandardTitle = () =>
    subTier === "max" ? (
      <div className="x:flex x:items-center x:gap-1">
        <LanguageModelTypeIcons.search className="x:size-4" />
        <span>Standard</span>
      </div>
    ) : (
      <span>Standard</span>
    );

  const renderReasoningTitle = () =>
    subTier === "max" ? (
      <div className="x:flex x:items-center x:gap-1">
        <LanguageModelTypeIcons.search className="x:size-4" />
        <span>Reasoning</span>
      </div>
    ) : (
      <span>Reasoning</span>
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
    <ContentComponent
      className={cn(
        "custom-scrollbar",
        "x:flex x:max-h-[calc(var(--available-height))] x:items-start x:justify-between x:gap-2 x:overflow-clip x:p-2",
        className,
      )}
    >
      {children}
      <div className="custom-scrollbar x:flex x:max-h-[calc(var(--available-height)-1rem)] x:items-start x:justify-between x:gap-2 x:overflow-y-auto">
        <LanguageModelGroup
          title={renderStandardTitle()}
          models={standard}
          tooltipPlacement="left"
        />

        <LanguageModelGroup
          title={renderReasoningTitle()}
          models={reasoning}
          tooltipPlacement="left"
        />

        {subTier === "pro" && !isCometAssistant && (
          <LanguageModelGroup
            title={<span>Advanced</span>}
            models={advanced}
            tooltipPlacement="right"
          />
        )}

        {subTier === "max" && !isCometAssistant && (
          <div className="x:flex x:flex-col x:gap-1">
            <LanguageModelGroup
              title={renderResearchTitle()}
              models={research}
              tooltipPlacement="right"
            />
            <LanguageModelGroup
              title={renderLabsTitle()}
              models={labs}
              tooltipPlacement="right"
            />
            <LanguageModelGroup
              title={renderStudyTitle()}
              models={study}
              tooltipPlacement="right"
            />
          </div>
        )}
      </div>
    </ContentComponent>
  );
}
