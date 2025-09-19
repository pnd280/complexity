import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/_context/context";
import { useCreatePortalContainer } from "@/plugins/_core/ui/groups/query-box/comet-assistant/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";

export default function CometAssistantQueryBoxWrapper() {
  const wrapper = queryBoxesDomObserverStore(
    (store) => store.wrapper.cometAssistant,
    deepEqual,
  );

  const container = useCreatePortalContainer(wrapper);

  if (!container) return null;

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "comet-assistant" }}>
      <Portal container={container}>
        <BetterLanguageModelSelectorWrapper />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
