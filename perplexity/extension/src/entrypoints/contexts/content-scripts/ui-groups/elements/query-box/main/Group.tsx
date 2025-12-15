import { Portal } from "@/components/ui/portal";
import { useRegisteredGlobalCssEntry } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { ScopedQueryBoxContextProvider } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/context";
import useLeftToolbarPortalContainer from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/hooks/useRightToolbarPortalContainer";
import { createQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/registry-factory";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: mainQueryBoxToolbarRegistry,
  useRegistry: useMainQueryBoxToolbarRegistry,
  Components: MainQueryBoxToolbarComponents,
  ComponentRegister: MainQueryBoxToolbarComponentRegister,
} = createQueryBoxToolbarRegistry();

export function MainQueryBoxToolbarComponentsGroup() {
  const { ll: llPortalContainer } = useLeftToolbarPortalContainer();
  const { rl: _rlPortalContainer } = useRightToolbarPortalContainer();

  useRegisteredGlobalCssEntry({
    entryIds: ["normalize-main-query-box"],
    subscriberId: "main-query-box-toolbar-components-group",
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main" }}>
      <Portal container={llPortalContainer}>
        <MainQueryBoxToolbarComponents group="ll" />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
