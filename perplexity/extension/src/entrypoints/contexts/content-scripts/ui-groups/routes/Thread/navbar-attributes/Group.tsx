import { Portal } from "@/components/ui/portal";
import { usePortalContainer } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/usePortalContainer";
import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: threadNavbarAttributesRegistry,
  useRegistry: useThreadNavbarAttributesRegistry,
  Components: ThreadNavbarAttributesComponents,
  ComponentRegister: ThreadNavbarAttributesComponentRegister,
} = createUiGroupRegistry();

export function ThreadNavbarAttributesPluginsGroup() {
  const portalContainer = usePortalContainer();

  return (
    <Portal container={portalContainer as HTMLElement}>
      <div className="x:flex x:items-center x:gap-2">
        <ThreadNavbarAttributesComponents />
      </div>
    </Portal>
  );
}
