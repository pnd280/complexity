import { Portal } from "@/components/ui/portal";
import { ThreadMessageIndexContextProvider } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import { usePortalContainers } from "@/plugins/__ui-groups__/elements/thread-query-edit-button/usePortalContainers";
import { createUiGroupRegistry } from "@/plugins/__ui-groups__/registry-factory";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: threadQueryEditButtonRegistry,
  useRegistry: useThreadQueryEditButtonRegistry,
  Components: ThreadQueryEditButtonComponents,
  ComponentRegister: ThreadQueryEditButtonComponentRegister,
} = createUiGroupRegistry();

export function ThreadQueryEditButtonPluginsGroup() {
  const portalContainers = usePortalContainers();

  return portalContainers.map((portalContainer, messageBlockIndex) => (
    <Portal key={messageBlockIndex} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={messageBlockIndex}>
        <div className="x:flex x:h-full x:items-center x:border-r x:border-border/30">
          <ThreadQueryEditButtonComponents />
        </div>
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}
