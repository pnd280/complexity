import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadQueryEditButtonComponentRegister } from "@/plugins/__ui-groups__/elements/thread-query-edit-button/Group";

const { QueryMetrics } = lazily(
  () => import("@/plugins/thread-message-metrics/QueryMetrics"),
);

function ThreadQueryMetricsWrapper() {
  return (
    <CsUiPluginsGuard
      location={["thread"]}
      dependentPluginIds={["thread:messageMetrics"]}
    >
      <ThreadQueryEditButtonComponentRegister>
        <QueryMetrics />
      </ThreadQueryEditButtonComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ThreadQueryMetricsWrapper />);
}
