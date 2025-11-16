import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { useThreadQueryEditButtonRegistry } from "@/plugins/__ui-groups__/elements/thread-query-edit-button/Group";

const { ThreadQueryEditButtonPluginsGroup } = lazily(
  () =>
    import("@/plugins/__ui-groups__/elements/thread-query-edit-button/Group"),
);

export default function ThreadQueryEditButtonComponentsGroupWrapper() {
  const shouldEnable = useThreadQueryEditButtonRegistry(
    (store) => store.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadQueryEditButtonPluginsGroup />
    </CsUiPluginsGuard>
  );
}
