import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { BetterCodeBlocks } = lazily(
  () => import("@/plugins/thread-better-code-blocks/BetterCodeBlocks"),
);

const BetterCodeBlocksWrapper = withPluginsGuard(BetterCodeBlocks, {
  dependentPluginIds: ["thread:betterCodeBlocks"],
  location: ["thread", "comet_assistant"],
});

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<BetterCodeBlocksWrapper />);
}
