import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SelectContent } from "@/components/ui/select";
import { usePluginGuardsStore } from "@/plugins/__async-deps__/plugins-guard/store";
import { ScopedQueryBoxContext } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import LanguageModelGroup from "@/plugins/language-model-selector/components/desktop/LanguageModelGroup";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import {
  getAdvancedStandaloneModels,
  getModelsByType,
} from "@/plugins/language-model-selector/utils";
import { LanguageModelTypeIcons } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

export default function DesktopContent() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { component } = context;

  const Comp = component === "dropdown" ? DropdownMenuContent : SelectContent;

  const subTier = usePluginGuardsStore((store) => store.subTier);

  const isCometAssistant =
    use(ScopedQueryBoxContext)?.store.type === "comet-assistant";

  const searchModels = getModelsByType("search");
  const searchFastModel = searchModels.filter((model) => !model.isReasoning);
  const searchReasoningModel = searchModels.filter(
    (model) => model.isReasoning,
  );
  const researchModels = getModelsByType("research");
  const labsModels = getModelsByType("studio");
  const studyModels = getModelsByType("study");
  const advancedModels = getAdvancedStandaloneModels();

  return (
    <Comp
      className={cn(
        PPLX_SCROLLBAR_CLASSES,
        "x:flex x:max-h-[calc(var(--available-height))] x:items-start x:justify-between x:gap-2 x:overflow-y-auto x:p-2",
      )}
    >
      <div className="x:flex x:items-start x:justify-between x:gap-2">
        <LanguageModelGroup
          title={
            subTier === "max" ? (
              <div className="x:flex x:items-center x:gap-1">
                <LanguageModelTypeIcons.search className="x:size-4" />
                <span>Standard</span>
              </div>
            ) : (
              <span>Standard</span>
            )
          }
          models={searchFastModel}
          tooltipPlacement="left"
        />

        <LanguageModelGroup
          title={
            subTier === "max" ? (
              <div className="x:flex x:items-center x:gap-1">
                <LanguageModelTypeIcons.search className="x:size-4" />
                <span>Reasoning</span>
              </div>
            ) : (
              <span>Reasoning</span>
            )
          }
          models={searchReasoningModel}
          tooltipPlacement="left"
        />

        {subTier === "pro" && !isCometAssistant && (
          <LanguageModelGroup
            title={<span>Advanced</span>}
            models={advancedModels}
            tooltipPlacement="right"
          />
        )}

        {subTier === "max" && !isCometAssistant && (
          <div className="x:flex x:flex-col x:gap-1">
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <LanguageModelTypeIcons.research className="x:size-4" />
                  <span>Research</span>
                </div>
              }
              models={researchModels}
              tooltipPlacement="right"
            />
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <LanguageModelTypeIcons.studio className="x:size-4" />
                  <span>Labs</span>
                </div>
              }
              models={labsModels}
              tooltipPlacement="right"
            />
            <LanguageModelGroup
              title={
                <div className="x:flex x:items-center x:gap-1">
                  <LanguageModelTypeIcons.study className="x:size-4" />
                  <span>Study</span>
                </div>
              }
              models={studyModels}
              tooltipPlacement="right"
            />
          </div>
        )}
      </div>
    </Comp>
  );
}
