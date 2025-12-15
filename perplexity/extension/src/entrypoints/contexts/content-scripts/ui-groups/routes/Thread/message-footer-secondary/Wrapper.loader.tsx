import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useThreadMessageFooterSecondaryRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer-secondary/Group";

const { ThreadMessageFooterSecondaryPluginsGroup } = lazily(
  () =>
    import("@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer-secondary/Group"),
);

function ThreadMessageFooterSecondaryComponentsGroupWrapper() {
  const shouldEnable = useThreadMessageFooterSecondaryRegistry(
    (store) => store.components.size > 0,
  );

  return (
    <CsUiGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadMessageFooterSecondaryPluginsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:thread:messageFooter:secondary",
    component: <ThreadMessageFooterSecondaryComponentsGroupWrapper />,
  });
}
