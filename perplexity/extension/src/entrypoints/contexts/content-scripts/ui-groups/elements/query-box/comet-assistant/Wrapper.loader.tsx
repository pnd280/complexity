import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useCometAssistantQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/comet-assistant/Group";

const { CometAssistantQueryBoxToolbarComponentsGroup } = lazily(
  () =>
    import("@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/comet-assistant/Group"),
);

function CometAssistantQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useCometAssistantQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.size > 0 ||
      store.lr.components.size > 0 ||
      store.rl.components.size > 0 ||
      store.rr.components.size > 0,
  );

  return (
    <CsUiGuard
      location={["comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <CometAssistantQueryBoxToolbarComponentsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:queryBox:cometAssistant",
    component: <CometAssistantQueryBoxToolbarComponentsGroupWrapper />,
  });
}
