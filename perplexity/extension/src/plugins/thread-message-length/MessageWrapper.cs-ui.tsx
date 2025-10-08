import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { MessageMetrics } = lazily(
  () => import("@/plugins/thread-message-length/MessageMetrics"),
);

const ThreadMessageMetricsWrapper = withPluginsGuard(MessageMetrics, {
  dependentPluginIds: ["thread:showMessageLength"],
});

export const uiGroup: UiGroupId = "thread:messageBlocks:footer";

export default ThreadMessageMetricsWrapper;
