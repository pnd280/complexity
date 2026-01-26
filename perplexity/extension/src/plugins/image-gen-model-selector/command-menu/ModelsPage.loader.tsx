import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { CommandMenuExternalPageRegister } from "@/plugins/command-menu/index.public";
import { ImageGenModelsPage } from "@/plugins/image-gen-model-selector/command-menu/ModelsPage";

declare module "@/plugins/command-menu/store/slices/pages/types" {
  interface CommandMenuPagesArgsRegistry {
    imageGenModels: void;
  }
}

function ImageGenModelsPageWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["imageGenModelSelector"]}>
      <CommandMenuExternalPageRegister id="plugin:imageGenModelSelector:modelsPage">
        <ImageGenModelsPage />
      </CommandMenuExternalPageRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:imageGenModelSelector:modelsPage",
    component: <ImageGenModelsPageWrapper />,
  });
}
