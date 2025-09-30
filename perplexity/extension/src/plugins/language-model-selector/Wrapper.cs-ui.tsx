import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import manifest from "@/plugins/language-model-selector/index.manifest";

const { LanguageModelSelector } = lazily(
  () => import("@/plugins/language-model-selector/LanguageModelSelector"),
);

const BetterLanguageModelSelectorWrapper = withPluginsGuard(
  LanguageModelSelector,
  {
    dependentPluginIds: ["queryBox:languageModelSelector"],
    mustHaveActiveSub: true,
    leastTier: "pro",
  },
);

export const uiGroup = manifest.meta.dependencies.uiGroups;

export default BetterLanguageModelSelectorWrapper;
