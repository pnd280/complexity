import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { TocPanel } = lazily(() => import("@/plugins/thread-toc/TocPanel"));

export const TocPanelWrapper = withPluginsGuard(TocPanel, {
  dependentPluginIds: ["thread:toc"],
  location: ["thread"],
});

export default TocPanelWrapper;
