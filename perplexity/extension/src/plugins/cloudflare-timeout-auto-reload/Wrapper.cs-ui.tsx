import { lazily } from "react-lazily";

import type { UiGroupId } from "@/data/registries/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { CloudflareTimeoutActionDialog } = lazily(
  () => import("@/plugins/cloudflare-timeout-auto-reload/ActionDialog"),
);

const CloudflareTimeoutActionDialogWrapper = withPluginsGuard(
  CloudflareTimeoutActionDialog,
  {
    dependentPluginIds: ["cloudflareTimeoutAutoReload"],
  },
);

export const uiGroup: UiGroupId = "global";

export default CloudflareTimeoutActionDialogWrapper;
