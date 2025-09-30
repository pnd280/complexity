import { lazily } from "react-lazily";

import type { UiGroupId } from "@/data/registries/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadBetterRewriteDropdown } = lazily(
  () =>
    import(
      "@/plugins/thread-better-rewrite-dropdown/ThreadBetterRewriteDropdown"
    ),
);

const ThreadBetterRewriteDropdownWrapper = withPluginsGuard(
  ThreadBetterRewriteDropdown,
  {
    dependentPluginIds: [
      "queryBox:languageModelSelector",
      "thread:betterRewriteDropdowns",
    ],
    excludeLocation: ["comet_assistant"],
    requiresLoggedIn: true,
    mustHaveActiveSub: true,
    leastTier: "pro",
  },
);

export const uiGroup: UiGroupId = "thread:messageBlocks:footer";

export default ThreadBetterRewriteDropdownWrapper;
