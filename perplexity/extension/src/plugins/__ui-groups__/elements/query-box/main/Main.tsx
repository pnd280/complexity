import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import useLeftToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/main/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/main/hooks/useRightToolbarPortalContainer";

export default function MainQueryBoxWrapper() {
  const { ll: llPortalContainer } = useLeftToolbarPortalContainer();
  const { rl: _rlPortalContainer } = useRightToolbarPortalContainer();

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main" }}>
      <Portal container={llPortalContainer}>
        {CsUiRegistry.QueryBoxToolbarMainGroupComponents.ll}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
