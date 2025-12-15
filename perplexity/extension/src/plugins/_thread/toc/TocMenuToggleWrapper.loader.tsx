import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadNavbarAttributesComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/Group";

const { TocMenuToggle } = lazily(
  () => import("@/plugins/_thread/toc/TocMenuToggle"),
);

function TocMenuToggleWrapper() {
  return (
    <CsUiGuard location={["thread"]} dependentPluginIds={["thread:toc"]}>
      <ThreadNavbarAttributesComponentRegister id="plugin:thread:toc">
        <TocMenuToggle />
      </ThreadNavbarAttributesComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:toc",
    component: <TocMenuToggleWrapper />,
  });
}
