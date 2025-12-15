import { Portal } from "@/components/ui/portal";
import { usePortalContainers } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/usePortalContainers";
import { ThreadMessageIndexContextProvider } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: threadMessageFooterRegistry,
  useRegistry: useThreadMessageFooterRegistry,
  Components: ThreadMessageFooterComponents,
  ComponentRegister: ThreadMessageFooterComponentRegister,
} = createUiGroupRegistry();

export function ThreadMessageFooterPluginsGroup() {
  const portalContainers = usePortalContainers();

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={index}>
        <div className="x:flex x:items-center x:gap-1">
          <ThreadMessageFooterComponents />
        </div>
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}
