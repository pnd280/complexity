import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import useLeftToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/follow-up/hooks/useLeftToolbarPortalContainer";
import useRightToolbarPortalContainer from "@/plugins/__ui-groups__/elements/query-box/follow-up/hooks/useRightToolbarPortalContainer";

export default function FollowUpQueryBoxWrapper() {
  const { ll: llPortalContainer } = useLeftToolbarPortalContainer();
  const { rl: rlPortalContainer } = useRightToolbarPortalContainer();

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
      <Portal container={llPortalContainer}>
        {CsUiRegistry.QueryBoxToolbarFollowUpGroupComponents.ll}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
