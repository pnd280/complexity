import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { useQueryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { usePortalContainer } from "@/plugins/__ui-groups__/elements/query-box/comet-assistant/usePortalContainer";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/context";

export default function CometAssistantQueryBoxWrapper() {
  const wrapper = useQueryBoxesDomObserverStore(
    (store) => store.wrapper.cometAssistant,
    deepEqual,
  );

  const container = usePortalContainer(wrapper);

  if (!container) return null;

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "comet-assistant" }}>
      <Portal container={container}>
        {CsUiRegistry.QueryBoxToolbarCometAssistantGroupComponents.rl}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
