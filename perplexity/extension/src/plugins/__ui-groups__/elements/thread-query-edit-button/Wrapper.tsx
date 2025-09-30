import { lazily } from "react-lazily";

import { shouldEnableUiGroup } from "@/plugins/__async-deps__/plugins-guard/predicates";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadQueryEditButtonPluginsGroup } = lazily(
  () =>
    import("@/plugins/__ui-groups__/elements/thread-query-edit-button/Group"),
);

const ThreadQueryEditButtonPluginsGroupWrapper = withPluginsGuard(
  ThreadQueryEditButtonPluginsGroup,
  {
    location: ["thread", "comet_assistant"],
    additionalCheck: () =>
      shouldEnableUiGroup({
        uiGroup: "thread:messageBlocks:queryEditButton",
      }),
  },
);

export default ThreadQueryEditButtonPluginsGroupWrapper;
