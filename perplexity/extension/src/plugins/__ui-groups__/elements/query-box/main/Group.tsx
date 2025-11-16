import { Portal } from "@/components/ui/portal";
import { useRegisteredGlobalCssEntry } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/context";
import useLeftToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/main/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/main/hooks/useRightToolbarPortalContainer";
import { createQueryBoxToolbarRegistry } from "@/plugins/__ui-groups__/elements/query-box/registry-factory";

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
