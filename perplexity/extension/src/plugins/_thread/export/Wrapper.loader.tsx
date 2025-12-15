import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadNavbarAttributesComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/Group";

const { ThreadExportMenu } = lazily(
  () => import("@/plugins/_thread/export/ExportMenu"),
);

function ExportThreadWrapper() {
  return (
    <CsUiGuard
      location={["thread"]}
      dependentPluginIds={["thread:exportThread"]}
    >
      <ThreadNavbarAttributesComponentRegister id="plugin:thread:exportThread">
        <ThreadExportMenu />
      </ThreadNavbarAttributesComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:exportThread",
    component: <ExportThreadWrapper />,
  });
}
