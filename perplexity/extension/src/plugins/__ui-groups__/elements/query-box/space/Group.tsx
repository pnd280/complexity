import { Portal } from "@/components/ui/portal";
import { useRegisteredGlobalCssEntry } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/context";
import { createQueryBoxToolbarRegistry } from "@/plugins/__ui-groups__/elements/query-box/registry-factory";
import useLeftToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/space/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/space/hooks/useRightToolbarPortalContainer";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: spaceQueryBoxToolbarRegistry,
  useRegistry: useSpaceQueryBoxToolbarRegistry,
  Components: SpaceQueryBoxToolbarComponents,
  ComponentRegister: SpaceQueryBoxToolbarComponentRegister,
} = createQueryBoxToolbarRegistry();

export function SpaceQueryBoxToolbarComponentsGroup() {
  const { ll: llPortalContainer } = useLeftToolbarPortalContainer();
  const { rl: rlPortalContainer } = useRightToolbarPortalContainer();

  useRegisteredGlobalCssEntry({
    entryIds: ["normalize-main-query-box"],
    subscriberId: "space-query-box-toolbar-components-group",
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "space" }}>
      <Portal container={llPortalContainer}>
        <SpaceQueryBoxToolbarComponents group="ll" />
      </Portal>
      <Portal container={rlPortalContainer}>
        <SpaceQueryBoxToolbarComponents group="rl" />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
