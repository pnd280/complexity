import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { SlashCommandMenu } = lazily(
  () => import("@/plugins/__core__/slash-command/SlashCommandMenu"),
);

const SlashCommandMenuWrapper = withPluginsGuard(SlashCommandMenu, {
  dependentCorePluginIds: ["slashCommand"],
});

export const uiGroup: UiGroupId = "global";

export default SlashCommandMenuWrapper;
