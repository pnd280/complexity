import { Cpu, Image } from "lucide-react";
import { useEffect } from "react";
import { useImmer } from "use-immer";

import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";
import Tooltip from "@/shared/components/Tooltip";
import { cn } from "@/utils/cn";
import UIUtils from "@/utils/UI";

import { ImageModel, imageModels } from ".";

export default function ImageModelSelector() {
  const limit = useQueryBoxStore((state) => state.imageCreateLimit);

  const [models, setModels] = useImmer<ImageModel[]>(
    imageModels.map((model) => ({
      ...model,
      tooltip: limit,
    })),
  );

  const value = useQueryBoxStore((state) => state.selectedImageModel);
  const setValue = useQueryBoxStore((state) => state.setSelectedImageModel);

  useEffect(() => {
    setModels((draft) => {
      draft.forEach((model) => {
        model.tooltip = limit;
      });
    });
  }, [limit, setModels]);

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        setValue(value as ImageModel["code"]);

        setTimeout(() => {
          UIUtils.getActiveQueryBoxTextarea({}).trigger("focus");
        }, 100);
      }}
    >
      <SelectTrigger variant="ghost" className="!tw-px-0 !tw-py-0">
        <Tooltip
          content="Choose image model"
          contentOptions={{
            sideOffset: 8,
          }}
        >
          <div className="tw-items-center tw-flex tw-min-h-8 !tw-w-fit tw-max-w-[200px] tw-select-none tw-justify-center tw-gap-2 !tw-px-2 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-zoom-in active:!tw-scale-95 [&_span]:tw-max-w-[150px]">
            <Image className="tw-size-4" />
            <SelectValue>
              {models.find((model) => model.code === value)?.shortLabel}
            </SelectValue>
            <span className="!tw-self-start tw-text-[.5rem] tw-text-accent-foreground">
              {models.find((model) => model.code === value)?.tooltip}
            </span>
          </div>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="tw-max-h-[500px] tw-max-w-[200px] tw-font-sans [&_span]:tw-truncate">
        {models.map((model) => (
          <Tooltip
            key={model.code}
            content={value !== model.code ? model.tooltip : undefined}
            contentOptions={{
              side: "right",
              sideOffset: 10,
            }}
          >
            <SelectItem
              key={model.code}
              value={model.code}
              className={cn({
                "tw-text-accent-foreground": model.code === value,
              })}
            >
              <div className="gap-2 tw-models-center tw-flex tw-justify-around">
                {model.icon ? (
                  <div className="tw-text-[1.1rem]">{model.icon}</div>
                ) : (
                  <Cpu className="tw-size-4" />
                )}
                <span>{model.label}</span>
              </div>
            </SelectItem>
          </Tooltip>
        ))}
      </SelectContent>
    </Select>
  );
}
