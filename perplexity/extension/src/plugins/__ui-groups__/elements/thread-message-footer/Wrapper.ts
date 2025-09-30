import { lazily } from "react-lazily";

import { shouldEnableUiGroup } from "@/plugins/__async-deps__/plugins-guard/predicates";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadMessageFooterPluginsGroup } = lazily(
  () => import("@/plugins/__ui-groups__/elements/thread-message-footer/Group"),
);

const ThreadMessageFooterPluginsGroupWrapper = withPluginsGuard(
  ThreadMessageFooterPluginsGroup,
  {
    location: ["thread", "comet_assistant"],
    additionalCheck: () =>
      shouldEnableUiGroup({
        uiGroup: "thread:messageBlocks:footer",
      }),
  },
);

export default ThreadMessageFooterPluginsGroupWrapper;
