import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/_context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui/groups/query-box/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";

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
        <BetterLanguageModelSelectorWrapper />
      </Portal>
      <Portal container={leftToolbar.rightContainer}>{null}</Portal>
    </ScopedQueryBoxContextProvider>
  );
}
