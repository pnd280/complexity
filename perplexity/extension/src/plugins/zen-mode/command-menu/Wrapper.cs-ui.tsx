import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { CommandMenuExternalPage } from "@/plugins/command-menu/index.public";
import { ZenModeCommandMenuEntries } from "@/plugins/zen-mode/command-menu/Entries";

export default function ZenModeCommandMenuEntriesWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["zenMode"]}>
      <CommandMenuExternalPage>
        <ZenModeCommandMenuEntries />
      </CommandMenuExternalPage>
    </CsUiPluginsGuard>
  );
}

ZenModeCommandMenuEntriesWrapper.displayName =
  "ZenModeCommandMenuEntriesWrapper";
