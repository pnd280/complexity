import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { CometAssistantQueryBoxToolbarComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/comet-assistant/Group";
import { FollowUpQueryBoxToolbarComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/Group";
import { MainQueryBoxToolbarComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/Group";
import { SpaceQueryBoxToolbarComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/space/Group";

const { LanguageModelSelector } = lazily(
  () => import("@/plugins/language-model-selector/LanguageModelSelector"),
);

function LanguageModelSelectorWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["queryBox:languageModelSelector"]}>
      <MainQueryBoxToolbarComponentRegister
        id="plugin:queryBox:languageModelSelector"
        group="ll"
      >
        <LanguageModelSelector />
      </MainQueryBoxToolbarComponentRegister>
      <SpaceQueryBoxToolbarComponentRegister
        id="plugin:queryBox:languageModelSelector"
        group="ll"
      >
        <LanguageModelSelector />
      </SpaceQueryBoxToolbarComponentRegister>
      <FollowUpQueryBoxToolbarComponentRegister
        id="plugin:queryBox:languageModelSelector"
        group="ll"
      >
        <LanguageModelSelector />
      </FollowUpQueryBoxToolbarComponentRegister>
      <CometAssistantQueryBoxToolbarComponentRegister
        id="plugin:queryBox:languageModelSelector"
        group="rl"
      >
        <LanguageModelSelector />
      </CometAssistantQueryBoxToolbarComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:queryBox:languageModelSelector",
    component: <LanguageModelSelectorWrapper />,
  });
}
