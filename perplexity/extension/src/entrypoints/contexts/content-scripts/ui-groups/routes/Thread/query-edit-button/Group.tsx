import { Portal } from "@/components/ui/portal";
import { ThreadMessageIndexContextProvider } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import { usePortalContainers } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/query-edit-button/usePortalContainers";
import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

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
        <div className="x:flex x:h-full x:items-center">
          <ThreadQueryEditButtonComponents />
        </div>
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}
