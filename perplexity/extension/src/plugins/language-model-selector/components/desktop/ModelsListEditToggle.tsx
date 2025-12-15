import { Button } from "@/components/ui/button";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

import TablerPencil from "~icons/tabler/pencil";

export default function ModelsListEditToggle() {
  const context = use(LanguageModelSelectorContext);

  if (!context) return null;

  const { isEditMode, toggleEditMode } = context;

  return (
    <div
      className={cn(
        "x:-top-2 x:-right-2 x:ml-auto x:cursor-pointer x:bg-background x:p-2 x:text-muted-foreground x:transition-all x:animate-in x:fade-in x:hover:text-foreground",
        isEditMode === true
          ? "x:inline-flex"
          : "x:absolute x:hidden x:items-center x:justify-center x:rounded-full x:border x:border-border/50 x:group-hover:inline-flex",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleEditMode();
      }}
    >
      {isEditMode === true ? (
        <div className="x:flex x:items-center x:gap-4">
          <div className="x:text-sm x:text-muted-foreground">
            {t(
              "plugin-model-selectors.languageModelSelector.modelsListEditToggle.instruction",
            )}
          </div>
          <Button variant="primary" size="sm" className="x:h-5.5">
            {t(
              "plugin-model-selectors.languageModelSelector.modelsListEditToggle.save",
            )}
          </Button>
        </div>
      ) : (
        <TablerPencil className="x:size-4" />
      )}
    </div>
  );
}
