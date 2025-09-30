import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadToc } = lazily(() => import("@/plugins/thread-toc/ThreadToc"));

export const ThreadTocWrapper = withPluginsGuard(ThreadToc, {
  dependentPluginIds: ["thread:toc"],
  location: ["thread"],
});

export default ThreadTocWrapper;
