import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { usePortalContainers } from "@/plugins/__ui-groups__/elements/thread-message-footer/usePortalContainers";
import { ThreadMessageIndexContextProvider } from "@/plugins/__ui-groups__/elements/thread-message-index-context";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    "thread:messageBlocks:footer": void;
  }
}

export function ThreadMessageFooterPluginsGroup() {
  const portalContainers = usePortalContainers();

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={index}>
        <div className="x:flex x:items-center x:gap-1">
          {CsUiRegistry.ThreadMessageFooterGroupComponents}
        </div>
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}
