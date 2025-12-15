import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

import TablerCheck from "~icons/tabler/check";
import TablerPencil from "~icons/tabler/pencil";

export default function ModelsListEditToggle() {
  const context = use(LanguageModelSelectorContext);

  if (!context) return null;

  const { isEditMode, toggleEditMode } = context;

  return (
    <div
      className={cn(
        "x:absolute x:-top-2 x:-right-2 x:cursor-pointer x:items-center x:justify-center x:rounded-full x:border x:border-border/50 x:bg-background x:p-2 x:text-muted-foreground x:transition-all x:animate-in x:fade-in x:hover:text-foreground",
        isEditMode === true
          ? "x:inline-flex"
          : "x:hidden x:group-hover:inline-flex",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleEditMode();
      }}
    >
      {isEditMode === true ? (
        <TablerCheck className="x:size-4" />
      ) : (
        <TablerPencil className="x:size-4" />
      )}
    </div>
  );
}
