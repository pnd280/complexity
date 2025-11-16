import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { useThreadMessageFooterRegistry } from "@/plugins/__ui-groups__/elements/thread-message-footer/Group";

const { ThreadMessageFooterPluginsGroup } = lazily(
  () => import("@/plugins/__ui-groups__/elements/thread-message-footer/Group"),
);

export default function ThreadMessageFooterComponentsGroupWrapper() {
  const shouldEnable = useThreadMessageFooterRegistry(
    (store) => store.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadMessageFooterPluginsGroup />
    </CsUiPluginsGuard>
  );
}
