import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { BetterSidebar } = lazily(
  () => import("@/plugins/better-sidebar/BetterSidebar"),
);

function BetterSidebarWrapper() {
  return (
    <CsUiPluginsGuard requiresLoggedIn dependentPluginIds={["betterSidebar"]}>
      <BetterSidebar />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<BetterSidebarWrapper />);
}
