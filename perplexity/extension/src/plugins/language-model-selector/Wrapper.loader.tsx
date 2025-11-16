import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { CometAssistantQueryBoxToolbarComponentRegister } from "@/plugins/__ui-groups__/elements/query-box/comet-assistant/Group";
import { FollowUpQueryBoxToolbarComponentRegister } from "@/plugins/__ui-groups__/elements/query-box/follow-up/Group";
import { MainQueryBoxToolbarComponentRegister } from "@/plugins/__ui-groups__/elements/query-box/main/Group";
import { SpaceQueryBoxToolbarComponentRegister } from "@/plugins/__ui-groups__/elements/query-box/space/Group";

const { LanguageModelSelector } = lazily(
  () => import("@/plugins/language-model-selector/LanguageModelSelector"),
);

function LanguageModelSelectorWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["queryBox:languageModelSelector"]}>
      <MainQueryBoxToolbarComponentRegister group="ll">
        <LanguageModelSelector />
      </MainQueryBoxToolbarComponentRegister>
      <SpaceQueryBoxToolbarComponentRegister group="ll">
        <LanguageModelSelector />
      </SpaceQueryBoxToolbarComponentRegister>
      <FollowUpQueryBoxToolbarComponentRegister group="ll">
        <LanguageModelSelector />
      </FollowUpQueryBoxToolbarComponentRegister>
      <CometAssistantQueryBoxToolbarComponentRegister group="rl">
        <LanguageModelSelector />
      </CometAssistantQueryBoxToolbarComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<LanguageModelSelectorWrapper />);
}
