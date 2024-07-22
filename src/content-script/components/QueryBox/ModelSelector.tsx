import { Cpu, Image } from "lucide-react";

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

type ModelItem = {
  label: string;
  shortLabel: string;
  code: string;
  icon: React.ReactNode;
  tooltip?: any;
};

type ModelSelectorProps<T extends ModelItem> = {
  type: "language" | "image";
  items: T[];
  onValueChange?: (value: T["code"]) => void;
  value?: T["code"];
};

export default function ModelSelector<T extends ModelItem>({
  type,
  items,
  onValueChange,
  value,
}: ModelSelectorProps<T>) {
  return (
    <Select
      value={value}
      onValueChange={(value: T["code"]) => {
        onValueChange?.(value);

        setTimeout(() => {
          UIUtils.getActiveQueryBoxTextarea({}).trigger("focus");
        }, 100);
      }}
    >
      <SelectTrigger variant="ghost" className="!tw-px-0 !tw-py-0">
        <Tooltip
          content={`Choose ${type} model`}
          contentOptions={{
            sideOffset: 8,
          }}
        >
          <div className="tw-flex tw-min-h-8 !tw-w-fit tw-max-w-[150px] tw-select-none tw-items-center tw-justify-center tw-gap-2 !tw-px-2 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-zoom-in active:!tw-scale-95 [&_span]:tw-max-w-[100px]">
            {type === "language" ? (
              <Cpu className="tw-size-4" />
            ) : (
              <Image className="tw-size-4" />
            )}
            <SelectValue>
              {items.find((model) => model.code === value)?.shortLabel}
            </SelectValue>
            <span className="!tw-self-start tw-text-[.5rem] tw-text-accent-foreground">
              {items.find((model) => model.code === value)?.tooltip}
            </span>
          </div>
        </Tooltip>
      </SelectTrigger>
      <SelectContent className="tw-max-h-[500px] tw-max-w-[200px] tw-font-sans [&_span]:tw-truncate">
        {items.map((model) => (
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
              <div className="gap-2 tw-flex tw-items-center tw-justify-around">
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
