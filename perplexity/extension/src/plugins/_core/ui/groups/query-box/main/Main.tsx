import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/_context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui/groups/query-box/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";

export default function MainQueryBoxWrapper() {
  const mainQueryBoxWrapper = queryBoxesDomObserverStore(
    (store) => store.wrapper.main,
    deepEqual,
  );

  if (!mainQueryBoxWrapper) return null;

  const { leftToolbar } = createToolbarPortalContainers({
    queryBoxWrapper: mainQueryBoxWrapper,
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main" }}>
      <Portal container={leftToolbar.leftContainer}>
        <BetterLanguageModelSelectorWrapper />
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <div className="x:flex x:size-full x:flex-wrap x:items-center"></div>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
