import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadNavbarAttributesComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/Group";

const { TocPanel } = lazily(() => import("@/plugins/_thread/toc/TocPanel"));

function TocPanelWrapper() {
  return (
    <CsUiGuard location={["thread"]} dependentPluginIds={["thread:toc"]}>
      <ThreadNavbarAttributesComponentRegister id="plugin:thread:tocPanel">
        <TocPanel />
      </ThreadNavbarAttributesComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:tocPanel",
    component: <TocPanelWrapper />,
  });
}
