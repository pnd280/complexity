import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { BetterMessageCopyButton } = lazily(
  () =>
    import(
      "@/plugins/thread-better-message-copy-buttons/ThreadBetterMessageCopyButton"
    ),
);

const ThreadBetterMessageCopyButtonWrapper = withPluginsGuard(
  BetterMessageCopyButton,
  {
    dependentPluginIds: ["thread:betterMessageCopyButtons"],
  },
);

export const uiGroup: UiGroupId = "thread:messageBlocks:footer";

export default ThreadBetterMessageCopyButtonWrapper;
