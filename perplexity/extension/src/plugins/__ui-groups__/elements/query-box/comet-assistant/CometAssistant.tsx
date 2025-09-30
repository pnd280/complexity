import { Portal } from "@/components/ui/portal";
import CsUiRegistry from "@/data/registries/cs-ui";
import { queryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import { useCreatePortalContainer } from "@/plugins/__ui-groups__/elements/query-box/comet-assistant/utils";

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
        {CsUiRegistry.QueryBoxToolbarCometAssistantGroupComponents.rl}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
