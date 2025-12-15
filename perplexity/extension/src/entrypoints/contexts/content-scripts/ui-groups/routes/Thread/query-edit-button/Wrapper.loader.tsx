import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useThreadQueryEditButtonRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/query-edit-button/Group";

const { ThreadQueryEditButtonPluginsGroup } = lazily(
  () =>
    import("@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/query-edit-button/Group"),
);

function ThreadQueryEditButtonComponentsGroupWrapper() {
  const shouldEnable = useThreadQueryEditButtonRegistry(
    (store) => store.components.size > 0,
  );

  return (
    <CsUiGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadQueryEditButtonPluginsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:thread:queryEditButton",
    component: <ThreadQueryEditButtonComponentsGroupWrapper />,
  });
}
