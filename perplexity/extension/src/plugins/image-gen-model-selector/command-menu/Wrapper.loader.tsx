import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { CommandMenuExternalPageRegister } from "@/plugins/command-menu/index.public";
import { ImageGenModelSelectorCommandMenuEntries } from "@/plugins/image-gen-model-selector/command-menu/Entries";

function ImageGenModelSelectorCommandMenuEntriesWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["imageGenModelSelector"]}>
      <CommandMenuExternalPageRegister id="plugin:imageGenModelSelector:commandMenuEntries">
        <ImageGenModelSelectorCommandMenuEntries />
      </CommandMenuExternalPageRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:imageGenModelSelector:commandMenuEntries",
    component: <ImageGenModelSelectorCommandMenuEntriesWrapper />,
  });
}
