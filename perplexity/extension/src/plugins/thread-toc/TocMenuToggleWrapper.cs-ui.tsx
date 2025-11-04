import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { TocMenuToggle } = lazily(
  () => import("@/plugins/thread-toc/TocMenuToggle"),
);

export const TocMenuToggleWrapper = withPluginsGuard(TocMenuToggle, {
  dependentPluginIds: ["thread:toc"],
  location: ["thread"],
});

export const uiGroup: UiGroupId = "thread:navbarAttributes";

export default TocMenuToggleWrapper;
