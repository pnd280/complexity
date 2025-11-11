import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { ThreadMessageIndexContextProvider } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import { usePortalContainers } from "@/plugins/__ui-groups__/elements/thread-query-edit-button/usePortalContainers";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    "thread:messageBlocks:queryEditButton": void;
  }
}

export function ThreadQueryEditButtonPluginsGroup() {
  const portalContainers = usePortalContainers();

  return portalContainers.map((portalContainer, messageBlockIndex) => (
    <Portal key={messageBlockIndex} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={messageBlockIndex}>
        <div className="x:flex x:h-full x:items-center">
          {CsUiRegistry.ThreadQueryEditButtonGroupComponents}
        </div>
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}
