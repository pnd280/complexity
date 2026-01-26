import { CommandInput as CommandInputPrimitive } from "@/components/ui/command";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";

import TablerChevronLeft from "~icons/tabler/chevron-left";

export default function CommandInput() {
  const { stack: pageStack } = useCommandMenuStore((store) => store.pagesStack);

  const { searchValue, setSearchValue } = useCommandMenuStore(
    (store) => store.states,
  );

  const placeholder =
    pageStack.length < 1
      ? t("plugin-command-menu.input.searchPlaceholder")
      : pageStack[pageStack.length - 1]!.searchPlaceholder;

  return (
    <div className="x:flex x:w-full x:items-center x:border-b x:border-border/50">
      {pageStack.length > 0 && (
        <div
          className="x:ml-2 x:cursor-pointer x:text-muted-foreground"
          onClick={() => {
            commandMenuStore.getState().pagesStack.pop();
          }}
        >
          <TablerChevronLeft className="x:size-4" />
        </div>
      )}
      <CommandInputPrimitive
        className="x:w-full x:border-none"
        placeholder={placeholder}
        value={searchValue}
        onValueChange={setSearchValue}
        onKeyDown={(e) => {
          if (searchValue.length > 0) return;
          if (e.key !== Key.Backspace) return;
          if (pageStack.length === 0) {
            commandMenuStore.getState().states.setOpen(false);
          }
          commandMenuStore.getState().pagesStack.pop();
        }}
      />
    </div>
  );
}
