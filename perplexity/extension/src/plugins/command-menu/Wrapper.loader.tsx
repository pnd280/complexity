import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { CommandMenu } = lazily(
  () => import("@/plugins/command-menu/CommandMenu"),
);

function CommandMenuWrapper() {
  return (
    <CsUiGuard
      excludeLocation={["comet_assistant"]}
      dependentPluginIds={["commandMenu"]}
    >
      <CommandMenu />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:commandMenu",
    component: <CommandMenuWrapper />,
  });
}
