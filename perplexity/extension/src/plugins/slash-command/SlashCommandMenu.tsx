import { PopoverContent, PopoverRootProvider } from "@/components/ui/popover";
import { PromptHistoryPage } from "@/plugins/prompt-history/index.public";
import { useBlurHandler } from "@/plugins/slash-command/hooks/useBlurHandler";
import useSlashCommandPanel from "@/plugins/slash-command/hooks/useSlashCommandPanel";
import IndexPage from "@/plugins/slash-command/pages/IndexPage";
import { slashCommandMenuStore } from "@/plugins/slash-command/store";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

export function SlashCommandMenu() {
  const popover = useSlashCommandPanel();

  const contentRef = useRef<HTMLDivElement | null>(null);

  useBlurHandler({
    contentRef,
    exceptionalElementSelectors: ["[data-prompt-history-clear-all-dialog]"],
  });

  return (
    <PopoverRootProvider lazyMount unmountOnExit value={popover}>
      <PopoverContent
        ref={contentRef}
        data-slash-command-menu-content
        className={cn(
          PPLX_SCROLLBAR_CLASSES,
          "x:w-(--reference-width) x:overflow-x-hidden x:rounded-2xl x:border-border/80 x:bg-secondary x:p-0 x:shadow-lg",
        )}
        onKeyDown={(e) => {
          if (e.key === Key.Escape) {
            slashCommandMenuStore.getState().setOpen(false);
          }
        }}
      >
        <div>
          <IndexPage />
          <PromptHistoryPage />
        </div>
      </PopoverContent>
    </PopoverRootProvider>
  );
}
