import { PplxImageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models";
import type { ImageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import type { CommandItemProps } from "@/plugins/command-menu/index.public";
import { imageGenModelSelectorStore } from "@/plugins/image-gen-model-selector/store";

import TablerCpu from "~icons/tabler/cpu";

type ItemsParams = {
  currentModel: ImageModel["code"];
};

export const getRawModelItems = ({
  currentModel,
}: ItemsParams): CommandItemProps[] => {
  return PplxImageModelsService.allModels.map((model) => {
    const Icon = (PplxImageModelsService.icons[model.code] ??
      TablerCpu) as React.ComponentType<React.SVGProps<SVGSVGElement>>;
    const isSelected = model.code === currentModel;

    return {
      eager: true,
      group: "",
      icon: Icon,
      keybinding: [],
      keywords: [
        "image",
        "model",
        "generator",
        model.label,
        model.shortLabel,
        model.code,
      ],
      onSelect: () => {
        imageGenModelSelectorStore.getState().setModel(model.code);
      },
      priority: isSelected ? 1 : 0,
      show: true,
      title: model.label,
      titleSuffixBadge: isSelected ? "Active" : undefined,
      value: `select-image-model-${model.code}`,
    };
  });
};
