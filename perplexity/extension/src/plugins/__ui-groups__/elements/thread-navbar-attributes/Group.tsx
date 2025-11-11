import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { usePortalContainer } from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/usePortalContainer";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    "thread:navbarAttributes": void;
  }
}

export function ThreadNavbarAttributesPluginsGroup() {
  const portalContainer = usePortalContainer();

  return (
    <Portal container={portalContainer as HTMLElement}>
      <div className="x:flex x:items-center x:gap-2">
        {CsUiRegistry.ThreadNavbarAttributesGroupComponents}
      </div>
    </Portal>
  );
}
