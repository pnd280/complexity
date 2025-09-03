import PplxRewrite from "@/components/icons/PplxRewrite";
import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import {
  threadMessageBlocksDomObserverStore,
  useThreadMessageBlocksDomObserverStore,
} from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useRegisteredGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import { DesktopContent } from "@/plugins/language-model-selector/index.public";
import { MobileContent } from "@/plugins/language-model-selector/index.public";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/index.public";
import { handleRewrite } from "@/plugins/thread-better-rewrite-dropdown/handle-rewrite";
import { isLanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function ThreadBetterRewriteDropdown() {
  const { messageBlockIndex } = useThreadMessageContext();

  const { isMobile } = useIsMobileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedItem, setHighlightedItem] =
    useState<LanguageModelCode | null>("claude2");

  useRegisteredGlobalCssEntry({
    entryIds: ["thread-message-footer-hide-native-rewrite-dropdowns"],
    subscriberId: "thread-better-rewrite-dropdown#" + messageBlockIndex,
  });

  const isReadOnly = useThreadMessageBlocksDomObserverStore((store) => {
    return store.messageBlocks?.[messageBlockIndex]?.states.isReadOnly;
  }, deepEqual);

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
          const modelPreferences =
            threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
              messageBlockIndex
            ]?.content.displayModel;
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
        });
      }}
    >
      <Tooltip content={t("common.misc.rewrite")}>
        <DropdownMenuTrigger asChild>
          <div
            className="x:cursor-pointer x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95"
            tabIndex={0}
          >
            <PplxRewrite className="x:size-4" />
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
          />
        ) : (
          <DesktopContent />
        )}
      </LanguageModelSelectorContext>
    </DropdownMenu>
  );
}
