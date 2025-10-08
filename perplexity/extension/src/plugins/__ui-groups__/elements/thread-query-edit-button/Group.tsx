import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { ThreadMessageIndexContextProvider } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import { useCreatePortalContainers } from "@/plugins/__ui-groups__/elements/thread-query-edit-button/useCreatePortalContainers";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    "thread:messageBlocks:queryEditButton": void;
  }
}

export function ThreadQueryEditButtonPluginsGroup() {
  const portalContainers = useCreatePortalContainers();

  return portalContainers.map((portalContainer, messageBlockIndex) => (
    <Portal key={messageBlockIndex} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={messageBlockIndex}>
        <MemoizedWrapper />
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper() {
  return (
    <div className="x:flex x:h-full x:items-center">
      {CsUiRegistry.ThreadQueryEditButtonGroupComponents}
    </div>
  );
});
