import { lazily } from "react-lazily";

import type { UiGroupId } from "@/data/registries/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { CommandMenu } = lazily(
  () => import("@/plugins/command-menu/CommandMenu"),
);

const CommandMenuWrapper = withPluginsGuard(CommandMenu, {
  dependentPluginIds: ["commandMenu"],
  excludeLocation: ["comet_assistant"],
});

export const uiGroup: UiGroupId = "global";

export default CommandMenuWrapper;
