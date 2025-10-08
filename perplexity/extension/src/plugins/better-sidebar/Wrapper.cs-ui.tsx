import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { BetterSidebar } = lazily(
  () => import("@/plugins/better-sidebar/BetterSidebar"),
);

export const BetterSidebarWrapper = withPluginsGuard(BetterSidebar, {
  dependentPluginIds: ["betterSidebar"],
  requiresLoggedIn: true,
});

export const uiGroup: UiGroupId = "global";

export default BetterSidebarWrapper;
