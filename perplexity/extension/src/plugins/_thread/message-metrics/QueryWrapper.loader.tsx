import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadQueryEditButtonComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/query-edit-button/Group";

const { QueryMetrics } = lazily(
  () => import("@/plugins/_thread/message-metrics/QueryMetrics"),
);

function ThreadQueryMetricsWrapper() {
  return (
    <CsUiGuard
      location={["thread"]}
      dependentPluginIds={["thread:messageMetrics"]}
    >
      <ThreadQueryEditButtonComponentRegister id="plugin:thread:messageMetrics">
        <QueryMetrics />
      </ThreadQueryEditButtonComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:messageMetrics:query",
    component: <ThreadQueryMetricsWrapper />,
  });
}
