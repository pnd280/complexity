import { Portal } from "@/components/ui/portal";
import CsUiRegistry from "@/data/registries/cs-ui";
import { queryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import { createToolbarPortalContainers } from "@/plugins/__ui-groups__/elements/query-box/utils";

export default function FollowUpQueryBoxWrapper() {
  const followUpQueryBoxWrapper = queryBoxesDomObserverStore(
    (store) => store.wrapper.followUp,
    deepEqual,
  );

  if (!followUpQueryBoxWrapper) return null;

  const { leftToolbar } = createToolbarPortalContainers({
    queryBoxWrapper: followUpQueryBoxWrapper,
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
      <Portal container={leftToolbar.leftContainer}>
        {CsUiRegistry.QueryBoxToolbarFollowUpGroupComponents.ll}
      </Portal>
      <Portal container={leftToolbar.rightContainer}>{null}</Portal>
    </ScopedQueryBoxContextProvider>
  );
}
