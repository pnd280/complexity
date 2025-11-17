import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/Group";

const { MessageMetrics } = lazily(
  () => import("@/plugins/_thread/message-metrics/MessageMetrics"),
);

function ThreadMessageMetricsWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["thread:messageMetrics"]}>
      <ThreadMessageFooterComponentRegister id="plugin:thread:messageMetrics">
        <MessageMetrics />
      </ThreadMessageFooterComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:messageMetrics",
    component: <ThreadMessageMetricsWrapper />,
  });
}
