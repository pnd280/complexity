import { lazily } from "react-lazily";

import { withCsUiGuard } from "@/entrypoints/contexts/content-scripts/services/ui-guard/hof";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { Artifacts } = lazily(
  () => import("@/plugins/_thread/artifacts/Artifacts"),
);

const ArtifactsWrapper = withCsUiGuard(Artifacts, {
  dependentPluginIds: ["thread:betterCodeBlocks", "thread:artifacts"],
  location: ["thread"],
});

export default function () {
  csUiMount({
    id: "plugin:thread:artifacts",
    component: <ArtifactsWrapper />,
  });
}
