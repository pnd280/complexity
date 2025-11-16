import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/plugins/__ui-groups__/elements/thread-message-footer/Group";

const { MessageMetrics } = lazily(
  () => import("@/plugins/thread-message-metrics/MessageMetrics"),
);

function ThreadMessageMetricsWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["thread:messageMetrics"]}>
      <ThreadMessageFooterComponentRegister>
        <MessageMetrics />
      </ThreadMessageFooterComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ThreadMessageMetricsWrapper />);
}
