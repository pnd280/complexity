import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/__ui-groups__/elements/query-box/_context/context";
import { createToolbarPortalContainers } from "@/plugins/__ui-groups__/elements/query-box/utils";

export default function SpaceQueryBoxWrapper() {
  const spaceQueryBoxWrapper = queryBoxesDomObserverStore(
    (store) => store.wrapper.space,
    deepEqual,
  );

  if (!spaceQueryBoxWrapper) return null;

  const { leftToolbar, rightToolbar } = createToolbarPortalContainers({
    queryBoxWrapper: spaceQueryBoxWrapper,
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "space" }}>
      <Portal container={leftToolbar.leftContainer}>
        {CsUiRegistry.QueryBoxToolbarSpaceGroupComponents.ll}
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <div className="x:flex x:size-full x:flex-wrap x:items-center x:gap-2"></div>
      </Portal>
      <Portal container={rightToolbar.leftContainer}>
        {CsUiRegistry.QueryBoxToolbarSpaceGroupComponents.rl}
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
