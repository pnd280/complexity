import { Portal } from "@/components/ui/portal";
import CsUiRegistry from "@/data/registries/cs-ui";
import { useCreatePortalContainers } from "@/plugins/__ui-groups__/elements/thread-message-footer/useCreatePortalContainers";
import { ThreadMessageIndexContextProvider } from "@/plugins/__ui-groups__/elements/thread-message-index-context";

declare module "@/data/registries/cs-ui/types" {
  interface UiGroupsRegistry {
    "thread:messageBlocks:footer": void;
  }
}

export function ThreadMessageFooterPluginsGroup() {
  const portalContainers = useCreatePortalContainers();

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={index}>
        <MemoizedWrapper />
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      {CsUiRegistry.ThreadMessageFooterGroupComponents}
    </div>
  );
});
