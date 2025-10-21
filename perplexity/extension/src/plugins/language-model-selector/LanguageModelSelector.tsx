import { createListCollection } from "@ark-ui/react";

import { Select, SelectContext, SelectTrigger } from "@/components/ui/select";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { useRegisteredGlobalCssEntry } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import {
  ScopedQueryBoxContext,
  useScopedQueryBoxContext,
} from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import { getActiveQueryBoxTextbox } from "@/plugins/__ui-groups__/elements/query-box/utils";
import CometAssistantLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/CometAssistantTriggerButton";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import BetterLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/TriggerButton";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useBetterLanguageModelSelectorStore } from "@/plugins/language-model-selector/store";
import { getSelectItems } from "@/plugins/language-model-selector/utils";
import type { LanguageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export function LanguageModelSelector() {
  const { isMobile } = useIsMobileStore();
  const { selectedLanguageModel, setSelectedLanguageModel } =
    useBetterLanguageModelSelectorStore((store) => ({
      selectedLanguageModel: store.model,
      setSelectedLanguageModel: store.setModel,
    }));
  const [highlightedItem, setHighlightedItem] = useState<LanguageModelCode>(
    selectedLanguageModel,
  );
  const [isOpen, setIsOpen] = useState(false);

  const selectItems = useMemo(getSelectItems, []);

  const listCollection = useMemo(
    () =>
      createListCollection({
        items: selectItems,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.id,
      }),
    [selectItems],
  );

  useRegisterGlobalCss();

  const isCometAssistant =
    use(ScopedQueryBoxContext)?.store.type === "comet-assistant";

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={listCollection}
      data-testid={
        DomSelectorsService.Root.testIds.QUERY_BOX.LANGUAGE_MODEL_SELECTOR
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
        {isCometAssistant ? (
          <CometAssistantLanguageModelSelectorTriggerButton />
        ) : (
          <BetterLanguageModelSelectorTriggerButton />
        )}
      </SelectTrigger>
      <LanguageModelSelectorContext
        value={{
          component: "select",
          setHighlightedItem,
        }}
      >
        {isMobile && !isCometAssistant ? (
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
