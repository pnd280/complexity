import { lazily } from "react-lazily";

import { withCsUiGuard } from "@/entrypoints/contexts/content-scripts/services/ui-guard/hof";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { BetterCodeBlocks } = lazily(
  () => import("@/plugins/_thread/better-code-blocks/BetterCodeBlocks"),
);

const BetterCodeBlocksWrapper = withCsUiGuard(BetterCodeBlocks, {
  dependentPluginIds: ["thread:betterCodeBlocks"],
  location: ["thread", "comet_assistant"],
});

export default function () {
  csUiMount({
    id: "plugin:thread:betterCodeBlocks",
    component: <BetterCodeBlocksWrapper />,
  });
}
