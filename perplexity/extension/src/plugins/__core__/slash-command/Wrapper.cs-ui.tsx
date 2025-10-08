import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { isMobileStore } from "@/hooks/is-mobile-store";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import { whereAmI } from "@/utils/misc/utils";

const { SlashCommandMenu } = lazily(
  () => import("@/plugins/__core__/slash-command/SlashCommandMenu"),
);

const SlashCommandMenuWrapper = withPluginsGuard(SlashCommandMenu, {
  dependentCorePluginIds: ["slashCommand"],
  additionalCheck: () => {
    return (
      !isMobileStore.getState().isMobile || whereAmI() === "comet_assistant"
    );
  },
});

export const uiGroup: UiGroupId = "global";

export default SlashCommandMenuWrapper;
