import { createListCollection } from "@ark-ui/react";
import { LuCpu as Cpu, LuImage as Image, LuCpu } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Portal } from "@/components/ui/portal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { useImageGenModelSelectorStore } from "@/plugins/image-gen-model-selector/store";
import usePortalContainer from "@/plugins/image-gen-model-selector/usePortalContainer";
import { PplxImageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-image-models";
import type { ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { isReactNode } from "@/types/utils.types";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

export function ImageGenModelSelector() {
  const portalContainer = usePortalContainer();

  const { data: pplxUserSettings } = usePplxUserSettings();

  const limit = pplxUserSettings?.create_limit ?? 0;

  const { selectedImageGenModel: value, setSelectedImageGenModel: setValue } =
    useImageGenModelSelectorStore(
      ({ selectedImageGenModel, setSelectedImageGenModel }) => ({
        selectedImageGenModel,
        setSelectedImageGenModel,
      }),
    );

  const handleValueChange = (details: { value: string[] }) => {
    setValue(details.value[0] as ImageModel["code"]);
  };

  return (
    <Portal container={portalContainer}>
      <Select
        data-testid={
          DomSelectorsService.Root.testIds.QUERY_BOX.IMAGE_GEN_MODEL_SELECTOR
        }
        collection={createListCollection({
          items: PplxImageModelsService.allModels.map((model) => model.code),
        })}
        className="x:mb-4 x:ml-auto x:w-fit"
        value={[value]}
        onValueChange={handleValueChange}
      >
        <Tooltip
          content={t("plugin-model-selectors.imageGenModelSelector.tooltip")}
          positioning={{
            gutter: 8,
          }}
        >
          <SelectTrigger variant="ghost">
            <div className="x:flex x:min-h-8 x:items-center x:justify-center x:gap-1">
              <Image className="x:size-4" />
              <SelectValue className="x:font-medium">
                {
                  PplxImageModelsService.allModels.find(
                    (model) => model.code === value,
                  )?.shortLabel
                }
              </SelectValue>
            </div>
          </SelectTrigger>
        </Tooltip>
        <SelectContent
          className={cn(
            PPLX_SCROLLBAR_CLASSES,
            "x:max-h-[500px] x:max-w-[200px] x:overflow-auto x:font-sans",
          )}
        >
          {PplxImageModelsService.allModels.map((model) => {
            const Icon = PplxImageModelsService.icons[model.code] ?? LuCpu;

            return (
              <Tooltip
                key={model.code}
                content={limit}
                positioning={{
                  placement: "right",
                  gutter: 10,
                }}
              >
                <SelectItem
                  key={model.code}
                  item={model.code}
                  className="x:font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="x:flex x:max-w-full x:items-center x:justify-around x:gap-2">
                    {isReactNode(<Icon />) ? (
                      <div className="x:text-[1.1rem]">
                        <Icon className="x:size-4" />
                      </div>
                    ) : (
                      <Cpu className="x:size-4" />
                    )}
                    <span className="x:truncate">{model.label}</span>
                  </div>
                </SelectItem>
              </Tooltip>
            );
          })}
        </SelectContent>
      </Select>
    </Portal>
  );
}
