import { createListCollection } from "@ark-ui/react";

import { Select, SelectContext, SelectTrigger } from "@/components/ui/select";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { useRegisteredGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui/groups/query-box/context/context";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";
import { getActiveQueryBoxTextbox } from "@/plugins/_core/ui/groups/query-box/utils";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import BetterLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/TriggerButton";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { getSelectItems } from "@/plugins/language-model-selector/utils";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function LanguageModelSelector() {
  const { isMobile } = useIsMobileStore();
  const { selectedLanguageModel, setSelectedLanguageModel } =
    useSharedQueryBoxStore((store) => ({
      selectedLanguageModel: store.selectedLanguageModel,
      setSelectedLanguageModel: store.setSelectedLanguageModel,
    }));
  const [highlightedItem, setHighlightedItem] = useState<LanguageModelCode>(
    selectedLanguageModel,
  );
  const [isOpen, setIsOpen] = useState(false);

  const selectItems = useMemo(getSelectItems, []);

  useRegisterGlobalCss();

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={createListCollection({
        items: selectItems,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.id,
      })}
      data-testid={
        getDomSelectorsRootService().testIds.QUERY_BOX.LANGUAGE_MODEL_SELECTOR
      }
      open={isOpen}
      value={[selectedLanguageModel]}
      highlightedValue={highlightedItem}
      onOpenChange={({ open }) => setIsOpen(open)}
      onValueChange={({ value }) => {
        setSelectedLanguageModel(value[0] as LanguageModelCode);
        setTimeout(() => {
          getActiveQueryBoxTextbox().trigger("focus");
        }, 100);
      }}
      onHighlightChange={({ highlightedValue }) =>
        setHighlightedItem(highlightedValue as LanguageModelCode)
      }
      onKeyDown={(event) => {
        if (event.key === Key.Escape) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(() => {
            getActiveQueryBoxTextbox().trigger("focus");
          }, 100);
        }
      }}
    >
      <SelectTrigger variant="noStyle" className="x:m-0 x:p-0">
        <BetterLanguageModelSelectorTriggerButton />
      </SelectTrigger>
      <LanguageModelSelectorContext
        value={{
          component: "select",
          setHighlightedItem,
        }}
      >
        {isMobile ? (
          <SelectContext>
            {({ open, setOpen }) => (
              <MobileContent
                open={open}
                onOpenChange={({ open }) => setOpen(open)}
              />
            )}
          </SelectContext>
        ) : (
          <DesktopContent />
        )}
      </LanguageModelSelectorContext>
    </Select>
  );
}

function useRegisterGlobalCss() {
  const { store } = useScopedQueryBoxContext();

  const subscriberId = "language-model-selector";

  useRegisteredGlobalCssEntry({
    entryIds: ["normalize-main-query-box"],
    subscriberId,
    subscribe: store.type === "main",
  });

  useRegisteredGlobalCssEntry({
    entryIds: ["normalize-follow-up-query-box"],
    subscriberId,
    subscribe: store.type === "follow-up",
  });

  useRegisteredGlobalCssEntry({
    entryIds: ["hide-native-model-selector"],
    subscriberId: `${subscriberId}#${store.type}`,
    subscribe: true,
  });
}
