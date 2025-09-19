import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/_context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui/groups/query-box/utils";
import ForceWritingModeToggle from "@/plugins/force-writing-mode/Wrapper";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";

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
        <BetterLanguageModelSelectorWrapper />
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <div className="x:flex x:size-full x:flex-wrap x:items-center x:gap-2"></div>
      </Portal>
      <Portal container={rightToolbar.leftContainer}>
        <ForceWritingModeToggle />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
