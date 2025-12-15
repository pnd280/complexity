import { Portal } from "@/components/ui/portal";
import { usePortalContainer } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/comet-assistant/usePortalContainer";
import { ScopedQueryBoxContextProvider } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/context";
import { createQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/registry-factory";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: cometAssistantQueryBoxToolbarRegistry,
  useRegistry: useCometAssistantQueryBoxToolbarRegistry,
  Components: CometAssistantQueryBoxToolbarComponents,
  ComponentRegister: CometAssistantQueryBoxToolbarComponentRegister,
} = createQueryBoxToolbarRegistry();

export function CometAssistantQueryBoxToolbarComponentsGroup() {
  const container = usePortalContainer();

  if (!container) return null;

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "comet-assistant" }}>
      <Portal container={container}>
        <CometAssistantQueryBoxToolbarComponents group="rl" />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
