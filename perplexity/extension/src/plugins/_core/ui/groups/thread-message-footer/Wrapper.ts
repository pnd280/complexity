import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";
import { shouldEnableUiGroup } from "@/plugins/_core/ui/groups/utils";

const { ThreadMessageFooterExtraButtons } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-message-footer/Group"),
);

const ThreadMessageFooterExtraButtonsWrapper = withPluginsGuard(
  ThreadMessageFooterExtraButtons,
  {
    additionalCheck: () =>
      shouldEnableUiGroup({
        uiGroup: "thread:messageBlocks:footer",
      }),
  },
);

export default ThreadMessageFooterExtraButtonsWrapper;
