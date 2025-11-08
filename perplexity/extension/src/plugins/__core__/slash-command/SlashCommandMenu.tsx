import { PopoverContent, PopoverRootProvider } from "@/components/ui/popover";
import { useBlurHandler } from "@/plugins/__core__/slash-command/hooks/useBlurHandler";
import useSlashCommandPanel from "@/plugins/__core__/slash-command/hooks/useSlashCommandPanel";
import IndexPage from "@/plugins/__core__/slash-command/pages/IndexPage";
import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/plugins/__core__/slash-command/store";

export function SlashCommandMenu() {
  const popover = useSlashCommandPanel();

  const contentRef = useRef<HTMLDivElement | null>(null);

  useBlurHandler({
    contentRef,
    exceptionalElementSelectors: ["[data-prompt-history-clear-all-dialog]"],
  });

  const externalPages = useSlashCommandMenuStore(
    (store) => store.pages.pages,
    deepEqual,
  );

  return (
    <PopoverRootProvider lazyMount unmountOnExit value={popover}>
      <PopoverContent
        ref={contentRef}
        data-slash-command-menu-content
        className={cn(
          "custom-scrollbar",
          "x:w-(--reference-width) x:overflow-x-hidden x:rounded-2xl x:border-border/80 x:bg-secondary x:p-0 x:shadow-lg",
        )}
        onKeyDown={(e) => {
          if (e.key === Key.Escape) {
            slashCommandMenuStore.getState().states.setOpen(false);
          }
        }}
      >
        <IndexPage />
        {externalPages}
      </PopoverContent>
    </PopoverRootProvider>
  );
}
