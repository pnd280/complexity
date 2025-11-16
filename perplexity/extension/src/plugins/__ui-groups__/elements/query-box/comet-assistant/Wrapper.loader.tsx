import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { useCometAssistantQueryBoxToolbarRegistry } from "@/plugins/__ui-groups__/elements/query-box/comet-assistant/Group";

const { CometAssistantQueryBoxToolbarComponentsGroup } = lazily(
  () =>
    import("@/plugins/__ui-groups__/elements/query-box/comet-assistant/Group"),
);

function CometAssistantQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useCometAssistantQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.length > 0 ||
      store.lr.components.length > 0 ||
      store.rl.components.length > 0 ||
      store.rr.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <CometAssistantQueryBoxToolbarComponentsGroup />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<CometAssistantQueryBoxToolbarComponentsGroupWrapper />);
}
