import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { Artifacts } = lazily(
  () => import("@/plugins/thread-artifacts/Artifacts"),
);

const ArtifactsWrapper = withPluginsGuard(Artifacts, {
  dependentPluginIds: ["thread:betterCodeBlocks", "thread:artifacts"],
  location: ["thread"],
});

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ArtifactsWrapper />);
}
