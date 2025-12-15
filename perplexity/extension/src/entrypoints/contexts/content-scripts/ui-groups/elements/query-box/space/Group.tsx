import { Portal } from "@/components/ui/portal";
import { useRegisteredGlobalCssEntry } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { ScopedQueryBoxContextProvider } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/context";
import { createQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/registry-factory";
import useLeftToolbarPortalContainer from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/space/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/space/hooks/useRightToolbarPortalContainer";

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
