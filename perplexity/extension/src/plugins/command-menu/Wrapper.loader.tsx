import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { CommandMenu } = lazily(
  () => import("@/plugins/command-menu/CommandMenu"),
);

function CommandMenuWrapper() {
  return (
    <CsUiPluginsGuard
      excludeLocation={["comet_assistant"]}
      dependentPluginIds={["commandMenu"]}
    >
      <CommandMenu />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<CommandMenuWrapper />);
}
