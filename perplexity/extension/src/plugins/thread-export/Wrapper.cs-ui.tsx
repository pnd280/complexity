import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadExport } = lazily(
  () => import("@/plugins/thread-export/ThreadExport"),
);

const ExportThreadWrapper = withPluginsGuard(ThreadExport, {
  dependentPluginIds: ["thread:exportThread"],
  location: ["thread"],
});

export default ExportThreadWrapper;
