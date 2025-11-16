import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { SpaceQueryBoxToolbarComponentRegister } from "@/plugins/__ui-groups__/elements/query-box/space/Group";

const { ForceWritingModeToggle } = lazily(
  () => import("@/plugins/force-writing-mode/ForceWritingMode"),
);

function ForceWritingModeToggleWrapper() {
  return (
    <CsUiPluginsGuard
      dependentPluginIds={["queryBox:spacesThreadsForceWritingMode"]}
    >
      <SpaceQueryBoxToolbarComponentRegister group="rl">
        <ForceWritingModeToggle />
      </SpaceQueryBoxToolbarComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ForceWritingModeToggleWrapper />);
}
