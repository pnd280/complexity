import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { CloudflareTimeoutActionDialog } = lazily(
  () => import("@/plugins/cloudflare-timeout-auto-reload/ActionDialog"),
);

function CloudflareTimeoutActionDialogWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["cloudflareTimeoutAutoReload"]}>
      <CloudflareTimeoutActionDialog />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<CloudflareTimeoutActionDialogWrapper />);
}
