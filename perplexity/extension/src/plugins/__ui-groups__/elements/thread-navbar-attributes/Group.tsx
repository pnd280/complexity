import CsUiRegistry from "@/__registries__/cs-ui";
import { Portal } from "@/components/ui/portal";
import { useCreatePortalContainer } from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/useCreatePortalContainer";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    "thread:navbarAttributes": void;
  }
}

export function ThreadNavbarAttributesPluginsGroup() {
  const portalContainer = useCreatePortalContainer();

  return (
    <Portal container={portalContainer as HTMLElement}>
      <div className="x:flex x:items-center x:gap-2">
        {CsUiRegistry.ThreadNavbarAttributesGroupComponents}
      </div>
    </Portal>
  );
}
