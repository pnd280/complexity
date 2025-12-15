import { createListCollection } from "@ark-ui/react";

import { Select, SelectContext, SelectTrigger } from "@/components/ui/select";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { useRegisteredGlobalCssEntry } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import {
  ScopedQueryBoxContext,
  useScopedQueryBoxContext,
} from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/context";
import { getActiveQueryBoxTextbox } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/utils";
import type { LanguageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import CometAssistantLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/CometAssistantTriggerButton";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import ModelsListEditToggle from "@/plugins/language-model-selector/components/desktop/ModelsListEditToggle";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import BetterLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/TriggerButton";
import { LanguageModelSelectorProvider } from "@/plugins/language-model-selector/context";
import { useBetterLanguageModelSelectorStore } from "@/plugins/language-model-selector/store";
import { getSelectItems } from "@/plugins/language-model-selector/utils";

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

  useRegisterGlobalCss();

  const isCometAssistant =
    use(ScopedQueryBoxContext)?.store.type === "comet-assistant";

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={createListCollection({
        items: getSelectItems(),
        itemToString: (item) => item.label,
        itemToValue: (item) => item.id,
      })}
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
      <LanguageModelSelectorProvider
        type="selector"
        setHighlightedItem={setHighlightedItem}
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
          <DesktopContent className="x:group x:flex-col-reverse">
            <ModelsListEditToggle />
          </DesktopContent>
        )}
      </LanguageModelSelectorProvider>
    </Select>
  );
}

function useRegisterGlobalCss() {
  const { store } = useScopedQueryBoxContext();

  const subscriberId = "language-model-selector";

  useRegisteredGlobalCssEntry({
    entryIds: ["hide-native-model-selector"],
    subscriberId: `${subscriberId}#${store.type}`,
    subscribe: true,
  });
}
