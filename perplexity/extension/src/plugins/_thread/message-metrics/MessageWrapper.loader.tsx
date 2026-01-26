import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterSecondaryComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer-secondary/Group";

const { MessageMetrics } = lazily(
  () => import("@/plugins/_thread/message-metrics/MessageMetrics"),
);

function ThreadMessageMetricsWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["thread:messageMetrics"]}>
      <ThreadMessageFooterSecondaryComponentRegister id="plugin:thread:messageMetrics">
        <MessageMetrics />
      </ThreadMessageFooterSecondaryComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:messageMetrics",
    component: <ThreadMessageMetricsWrapper />,
  });
}
