import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useThreadMessageFooterRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/Group";

const { ThreadMessageFooterPluginsGroup } = lazily(
  () =>
    import("@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/Group"),
);

function ThreadMessageFooterComponentsGroupWrapper() {
  const shouldEnable = useThreadMessageFooterRegistry(
    (store) => store.components.size > 0,
  );

  return (
    <CsUiGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadMessageFooterPluginsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:thread:messageFooter",
    component: <ThreadMessageFooterComponentsGroupWrapper />,
  });
}
