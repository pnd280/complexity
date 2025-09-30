import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { BetterCodeBlocks } = lazily(
  () => import("@/plugins/thread-better-code-blocks/BetterCodeBlocks"),
);

const BetterCodeBlocksWrapper = withPluginsGuard(BetterCodeBlocks, {
  dependentPluginIds: ["thread:betterCodeBlocks"],
  location: ["thread", "comet_assistant"],
});

export default BetterCodeBlocksWrapper;
