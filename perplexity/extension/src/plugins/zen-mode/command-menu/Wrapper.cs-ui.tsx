import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ZenModeCommandMenuEntries } = lazily(
  () => import("@/plugins/zen-mode/command-menu/Entries"),
);

const ZenModeCommandMenuEntriesWrapper = withPluginsGuard(
  ZenModeCommandMenuEntries,
  {
    dependentPluginIds: ["zenMode"],
  },
);

export const uiGroup: UiGroupId = "commandMenu";

export default ZenModeCommandMenuEntriesWrapper;
