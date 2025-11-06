import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { useRegisteredGlobalCssEntry } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import { DesktopContent } from "@/plugins/language-model-selector/index.public";
import { MobileContent } from "@/plugins/language-model-selector/index.public";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/index.public";
import { handleRewrite } from "@/plugins/thread-better-rewrite-dropdown/handle-rewrite";
import RedoSearchSwitch from "@/plugins/thread-better-rewrite-dropdown/RedoSearchSwitch";
import { isLanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

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

  const modelPreferences = useThreadMessageBlocksDomObserverStore((store) => {
    return store.messageBlocks?.[messageBlockIndex]?.content.displayModel;
  });

  const haveSources = useThreadMessageBlocksDomObserverStore((store) => {
    return (
      store.messageBlocks?.[messageBlockIndex]?.content.webResults != null &&
      store.messageBlocks[messageBlockIndex].content.webResults.length > 0
    );
  });

  if (isReadOnly) return null;

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      open={isOpen}
      highlightedValue={highlightedItem}
      positioning={{
        placement: "bottom-end",
      }}
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
            className="x:cursor-pointer x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95"
            tabIndex={0}
          >
            <TaberRepeat className="x:size-4" />
          </div>
        </DropdownMenuTrigger>
      </Tooltip>

      <LanguageModelSelectorContext
        value={{
          component: "dropdown",
          setHighlightedItem,
        }}
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
      </LanguageModelSelectorContext>
    </DropdownMenu>
  );
}
