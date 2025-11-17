import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useThreadNavbarAttributesRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/Group";

const { ThreadNavbarAttributesPluginsGroup } = lazily(
  () =>
    import(
      "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/Group"
    ),
);

function ThreadNavbarAttributesComponentsGroupWrapper() {
  const shouldEnable = useThreadNavbarAttributesRegistry(
    (store) => store.components.size > 0,
  );

  return (
    <CsUiGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadNavbarAttributesPluginsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:thread:navbarAttributes",
    component: <ThreadNavbarAttributesComponentsGroupWrapper />,
  });
}
