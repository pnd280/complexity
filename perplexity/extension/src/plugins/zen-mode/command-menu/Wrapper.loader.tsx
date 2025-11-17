import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { CommandMenuExternalPageRegister } from "@/plugins/command-menu/index.public";
import { ZenModeCommandMenuEntries } from "@/plugins/zen-mode/command-menu/Entries";

function ZenModeCommandMenuEntriesWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["zenMode"]}>
      <CommandMenuExternalPageRegister id="plugin:zenMode:commandMenuEntries">
        <ZenModeCommandMenuEntries />
      </CommandMenuExternalPageRegister>
    </CsUiGuard>
  );
}

ZenModeCommandMenuEntriesWrapper.displayName =
  "ZenModeCommandMenuEntriesWrapper";

export default function () {
  csUiMount({
    id: "plugin:zenMode:commandMenuEntries",
    component: <ZenModeCommandMenuEntriesWrapper />,
  });
}
