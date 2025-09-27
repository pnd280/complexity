import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SelectContent } from "@/components/ui/select";
import { usePluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import { ScopedQueryBoxContext } from "@/plugins/_core/ui/groups/query-box/_context/context";
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

  const searchModels = useMemo(() => getModelsByType("search"), []);
  const searchFastModel = useMemo(
    () => searchModels.filter((model) => !model.isReasoning),
    [searchModels],
  );
  const searchReasoningModel = useMemo(
    () => searchModels.filter((model) => model.isReasoning),
    [searchModels],
  );
  const researchModels = useMemo(() => getModelsByType("research"), []);
  const labsModels = useMemo(() => getModelsByType("studio"), []);
  const advancedModels = useMemo(() => getAdvancedStandaloneModels(), []);

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
          </div>
        )}

        {subTier === "pro" && !isCometAssistant && (
          <LanguageModelGroup
            title={<span>Advanced</span>}
            models={advancedModels}
            tooltipPlacement="right"
          />
        )}
      </div>
    </Comp>
  );
}
