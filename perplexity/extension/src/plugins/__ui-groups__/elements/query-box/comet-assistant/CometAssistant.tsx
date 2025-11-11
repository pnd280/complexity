import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { usePortalContainer } from "@/plugins/__ui-groups__/elements/query-box/comet-assistant/usePortalContainer";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/context";

export default function CometAssistantQueryBoxWrapper() {
  const container = usePortalContainer();

  if (!container) return null;

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "comet-assistant" }}>
      <Portal container={container}>
        {CsUiRegistry.QueryBoxToolbarCometAssistantGroupComponents.rl}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
