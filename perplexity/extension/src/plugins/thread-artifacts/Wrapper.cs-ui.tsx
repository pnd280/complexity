import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { Artifacts } = lazily(
  () => import("@/plugins/thread-artifacts/Artifacts"),
);

const ArtifactsWrapper = withPluginsGuard(Artifacts, {
  dependentPluginIds: ["thread:betterCodeBlocks", "thread:artifacts"],
  location: ["thread"],
});

export default ArtifactsWrapper;
