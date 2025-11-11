import { PopoverContent, PopoverRootProvider } from "@/components/ui/popover";
import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { useBlurHandler } from "@/plugins/__core__/slash-command/hooks/useBlurHandler";
import useSlashCommandPanel from "@/plugins/__core__/slash-command/hooks/useSlashCommandPanel";
import { slashCommandMenuCssResourceConfig } from "@/plugins/__core__/slash-command/index.remote-resources";
import { ExternalPages } from "@/plugins/__core__/slash-command/pages/ExternalPages";
import IndexPage from "@/plugins/__core__/slash-command/pages/IndexPage";
import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/plugins/__core__/slash-command/store";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

const styles = await getVersionedRemoteResource(
  slashCommandMenuCssResourceConfig,
  persistentQueryClient,
);

export function SlashCommandMenu() {
  const popover = useSlashCommandPanel();

  const contentRef = useRef<HTMLDivElement | null>(null);

  useBlurHandler({
    contentRef,
    exceptionalElementSelectors: ["[data-prompt-history-clear-all-dialog]"],
  });

  useInsertCss({
    id: "slash-command-menu",
    css: styles,
  });

  const portalContainer = useSlashCommandMenuStore(
    (store) => $(store.anchor.portalContainer ?? {}).parent()[0],
  );

  return (
    <Portal container={portalContainer}>
      <PopoverRootProvider lazyMount unmountOnExit value={popover}>
        <PopoverContent
          ref={contentRef}
          data-slash-command-menu-content
          portal={false}
          className={cn(
            "custom-scrollbar",
            "x:w-(--reference-width) x:overflow-x-hidden x:rounded-2xl x:border-[1.5px] x:border-border x:bg-secondary x:p-0 x:shadow-lg",
          )}
          onKeyDown={(e) => {
            if (e.key === Key.Escape) {
              slashCommandMenuStore.getState().states.setOpen(false);
            }
          }}
        >
          <IndexPage />
          <ExternalPages />
        </PopoverContent>
      </PopoverRootProvider>
    </Portal>
  );
}
