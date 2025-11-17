import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { BetterSidebar } = lazily(
  () => import("@/plugins/better-sidebar/BetterSidebar"),
);

function BetterSidebarWrapper() {
  return (
    <CsUiGuard requiresLoggedIn dependentPluginIds={["betterSidebar"]}>
      <BetterSidebar />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:betterSidebar",
    component: <BetterSidebarWrapper />,
  });
}
