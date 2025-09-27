import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ThreadExport } = lazily(
  () => import("@/plugins/thread-export/ThreadExport"),
);

const ExportThreadWrapper = withPluginsGuard(ThreadExport, {
  dependentPluginIds: ["thread:exportThread"],
});

export default ExportThreadWrapper;
