import { lazily } from "react-lazily";

import type { UiGroupId } from "@/data/registries/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadMessageTtsButton } = lazily(
  () => import("@/plugins/thread-message-tts/ThreadMessageTtsButton"),
);

const ThreadMessageTtsButtonWrapper = withPluginsGuard(ThreadMessageTtsButton, {
  dependentPluginIds: ["thread:messageTts"],
  requiresLoggedIn: true,
});

export const uiGroup: UiGroupId = "thread:messageBlocks:footer";

export default ThreadMessageTtsButtonWrapper;
