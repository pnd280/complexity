import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ForceWritingModeToggle } = lazily(
  () => import("@/plugins/force-writing-mode/ForceWritingMode"),
);

const ForceWritingModeToggleWrapper = withPluginsGuard(ForceWritingModeToggle, {
  dependentPluginIds: ["queryBox:spacesThreadsForceWritingMode"],
});

export const uiGroup: UiGroupId = "queryBoxes:toolbar:space:rl";

export default ForceWritingModeToggleWrapper;
