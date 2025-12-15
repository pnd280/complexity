import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { useRegisteredGlobalCssEntry } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { useThreadMessageIndexContext } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import { isLanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";
import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { handleRewrite } from "@/plugins/_thread/better-rewrite-dropdown/handle-rewrite";
import RedoSearchSwitch from "@/plugins/_thread/better-rewrite-dropdown/RedoSearchSwitch";
import {
  DesktopContent,
  LanguageModelSelectorProvider,
  MobileContent,
} from "@/plugins/language-model-selector/index.public";

import TaberRepeat from "~icons/tabler/repeat";

export function ThreadBetterRewriteDropdown() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const { isMobile } = useIsMobileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedItem, setHighlightedItem] =
    useState<LanguageModelCode | null>("claude2");

  const [redoSearch, setRedoSearch] = useState<boolean>(false);

  useRegisteredGlobalCssEntry({
    entryIds: ["thread-message-footer-hide-native-rewrite-dropdowns"],
    subscriberId: "thread-better-rewrite-dropdown#" + messageBlockIndex,
  });

  const isReadOnly = useThreadMessageBlocksDomObserverStore((store) => {
    return store.messageBlocks?.[messageBlockIndex]?.states.isReadOnly;
  });

  const isNotTextAnswer = useThreadMessageBlocksDomObserverStore((store) => {
    return (
      store.messageBlocks?.[messageBlockIndex]?.content.answer.length === 0
    );
  });

  const modelPreferences = useThreadMessageBlocksDomObserverStore((store) => {
    return store.messageBlocks?.[messageBlockIndex]?.content.displayModel;
  });

  const haveSources = useThreadMessageBlocksDomObserverStore((store) => {
    return (
      store.messageBlocks?.[messageBlockIndex]?.content.webResults != null &&
      store.messageBlocks[messageBlockIndex].content.webResults.length > 0
    );
  });

  if (isReadOnly || isNotTextAnswer) return null;

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      open={isOpen}
      highlightedValue={highlightedItem}
      onOpenChange={async ({ open }) => {
        if (open) {
          setHighlightedItem(modelPreferences ?? null);
        }

        setIsOpen(open);
      }}
      onHighlightChange={({ highlightedValue }) => {
        if (highlightedValue && isLanguageModelCode(highlightedValue)) {
          setHighlightedItem(highlightedValue);
        }
      }}
      onSelect={({ value }) => {
        handleRewrite({
          selectedModel: value as LanguageModelCode,
          messageBlockIndex,
          redoSearch: redoSearch === true,
        });
      }}
    >
      <Tooltip content={t("common.misc.rewrite")}>
        <DropdownMenuTrigger asChild>
          <div
            data-better-rewrite-dropdown="true"
            className="x:cursor-pointer x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95"
            tabIndex={0}
          >
            <TaberRepeat className="x:size-4" />
          </div>
        </DropdownMenuTrigger>
      </Tooltip>

      <LanguageModelSelectorProvider
        type="rewrite"
        setHighlightedItem={setHighlightedItem}
      >
        {isMobile ? (
          <MobileContent
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
          >
            {haveSources && (
              <RedoSearchSwitch
                redoSearch={redoSearch}
                setRedoSearch={setRedoSearch}
              />
            )}
          </MobileContent>
        ) : (
          <DesktopContent className="x:flex x:flex-col-reverse x:gap-2">
            {haveSources && (
              <RedoSearchSwitch
                className="x:w-full x:border-t x:border-border/50 x:p-2 x:pt-3"
                redoSearch={redoSearch}
                setRedoSearch={setRedoSearch}
              />
            )}
          </DesktopContent>
        )}
      </LanguageModelSelectorProvider>
    </DropdownMenu>
  );
}
