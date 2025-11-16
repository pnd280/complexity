import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { CommandMenuExternalPageRegister } from "@/plugins/command-menu/index.public";
import { ZenModeCommandMenuEntries } from "@/plugins/zen-mode/command-menu/Entries";

function ZenModeCommandMenuEntriesWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["zenMode"]}>
      <CommandMenuExternalPageRegister>
        <ZenModeCommandMenuEntries />
      </CommandMenuExternalPageRegister>
    </CsUiPluginsGuard>
  );
}

ZenModeCommandMenuEntriesWrapper.displayName =
  "ZenModeCommandMenuEntriesWrapper";

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<ZenModeCommandMenuEntriesWrapper />);
}
