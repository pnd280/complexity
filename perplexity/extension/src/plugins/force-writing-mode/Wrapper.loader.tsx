import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { SpaceQueryBoxToolbarComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/space/Group";

const { ForceWritingModeToggle } = lazily(
  () => import("@/plugins/force-writing-mode/ForceWritingMode"),
);

function ForceWritingModeToggleWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["queryBox:spacesThreadsForceWritingMode"]}>
      <SpaceQueryBoxToolbarComponentRegister
        id="plugin:queryBox:spacesThreadsForceWritingMode:forceWritingModeToggle"
        group="rl"
      >
        <ForceWritingModeToggle />
      </SpaceQueryBoxToolbarComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:queryBox:spacesThreadsForceWritingMode:forceWritingModeToggle",
    component: <ForceWritingModeToggleWrapper />,
  });
}
