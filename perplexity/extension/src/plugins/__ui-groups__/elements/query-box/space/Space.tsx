import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/context";
import useLeftToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/space/hooks/useLeftToolbarPortalContainer copy";
import useRightToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/space/hooks/useRightToolbarPortalContainer";

export default function SpaceQueryBoxWrapper() {
  const { ll: llPortalContainer } = useLeftToolbarPortalContainer();
  const { rl: rlPortalContainer } = useRightToolbarPortalContainer();

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "space" }}>
      <Portal container={llPortalContainer}>
        {CsUiRegistry.QueryBoxToolbarSpaceGroupComponents.ll}
      </Portal>
      <Portal container={rlPortalContainer}>
        {CsUiRegistry.QueryBoxToolbarSpaceGroupComponents.rl}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
