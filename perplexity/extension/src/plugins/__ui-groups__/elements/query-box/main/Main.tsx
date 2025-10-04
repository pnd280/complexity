import { Portal } from "@/components/ui/portal";
import CsUiRegistry from "@/data/registries/cs-ui";
import { queryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import { createToolbarPortalContainers } from "@/plugins/__ui-groups__/elements/query-box/utils";

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
        {CsUiRegistry.QueryBoxToolbarMainGroupComponents.ll}
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <div className="x:flex x:size-full x:flex-wrap x:items-center"></div>
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
