import { Portal } from "@/components/ui/portal";
import { useRegisteredGlobalCssEntry } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { ScopedQueryBoxContextProvider } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/context";
import useLeftToolbarPortalContainer from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/hooks/useRightToolbarPortalContainer";
import { createQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/registry-factory";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: followUpQueryBoxToolbarRegistry,
  useRegistry: useFollowUpQueryBoxToolbarRegistry,
  Components: FollowUpQueryBoxToolbarComponents,
  ComponentRegister: FollowUpQueryBoxToolbarComponentRegister,
} = createQueryBoxToolbarRegistry();

export function FollowUpQueryBoxToolbarComponentsGroup() {
  const { ll: llPortalContainer } = useLeftToolbarPortalContainer();
  const { rl: _rlPortalContainer } = useRightToolbarPortalContainer();

  useRegisteredGlobalCssEntry({
    entryIds: ["normalize-follow-up-query-box"],
    subscriberId: "follow-up-query-box-toolbar-components-group",
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
      <Portal container={llPortalContainer}>
        <FollowUpQueryBoxToolbarComponents group="ll" />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
