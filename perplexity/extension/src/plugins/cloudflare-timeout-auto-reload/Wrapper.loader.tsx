import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { CloudflareTimeoutActionDialog } = lazily(
  () => import("@/plugins/cloudflare-timeout-auto-reload/ActionDialog"),
);

function CloudflareTimeoutActionDialogWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["cloudflareTimeoutAutoReload"]}>
      <CloudflareTimeoutActionDialog />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:cloudflareTimeoutAutoReload:actionDialog",
    component: <CloudflareTimeoutActionDialogWrapper />,
  });
}
