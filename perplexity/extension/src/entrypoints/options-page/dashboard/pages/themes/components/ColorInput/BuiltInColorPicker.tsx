import { useFormContext } from "react-hook-form";
import { FaTimesCircle } from "react-icons/fa";
import { FaPalette } from "react-icons/fa6";

import Tooltip from "@/components/Tooltip";
import {
  RadioRoot,
  RadioItem,
  RadioItemControl,
  RadioItemHiddenInput,
} from "@/components/ui/radio";
import {
  cometColors,
  cplxColors,
  type BuiltInColorValue,
  type ColorPalette,
} from "@/data/dashboard/themes/built-in-colors";
import type { ThemeFormValues } from "@/data/dashboard/themes/theme.types";

type ColorOptionProps = {
  option: ColorPalette;
  isSelected: boolean;
  onClick: () => void;
};

function ColorOption({ option, isSelected, onClick }: ColorOptionProps) {
  return (
    <Tooltip content={option.label || option.value}>
      <RadioItem value={option.value} onClick={onClick}>
        <RadioItemControl
          className={cn(
            "x:relative x:mt-0 x:size-10 x:items-center x:justify-center x:overflow-hidden x:rounded-lg x:border-0 x:transition-all",
            {
              "x:outline-2 x:outline-offset-2 x:outline-primary": isSelected,
            },
          )}
        >
          <div className="x:flex x:h-full x:w-full">
            <div
              className="x:h-full x:w-1/2"
              style={{
                backgroundColor: `oklch(${option.color.light.super200})`,
              }}
            />
            <div
              className="x:h-full x:w-1/2"
              style={{
                backgroundColor: `oklch(${option.color.dark.super200})`,
              }}
            />
          </div>
        </RadioItemControl>
        <RadioItemHiddenInput />
      </RadioItem>
    </Tooltip>
  );
}

type ActionOptionProps = {
  value: "custom" | "default";
  icon: React.ReactNode;
  tooltip: string;
  isSelected: boolean;
};

function ActionOption({ value, icon, tooltip, isSelected }: ActionOptionProps) {
  return (
    <Tooltip content={tooltip}>
      <RadioItem value={value}>
        <RadioItemControl
          className={cn(
            "x:relative x:mt-0 x:size-10 x:items-center x:justify-center x:overflow-hidden x:rounded-lg x:border x:border-border/50 x:text-muted-foreground! x:transition-all",
            {
              "x:border-none x:outline-2 x:outline-offset-2 x:outline-primary":
                isSelected,
            },
          )}
        >
          {icon}
        </RadioItemControl>
        <RadioItemHiddenInput />
      </RadioItem>
    </Tooltip>
  );
}

export default function BuiltInColorPicker() {
  const { watch, setValue, resetField } = useFormContext<ThemeFormValues>();

  const accentColorSelection = watch("accentColorSelection");
  const selectedColor = watch("builtInAccentColor") ?? "cplx-blue";
  const allColors = [...cplxColors, ...cometColors] as ColorPalette[];

  const handleColorSelect = (color: BuiltInColorValue) => {
    setValue("builtInAccentColor", color);
  };

  const handleValueChange = (value: string) => {
    if (value === "custom" || value === "default") {
      resetField("accentColor");
      setValue("accentColorSelection", value);
      return;
    }

    if (value) {
      handleColorSelect(value as BuiltInColorValue);
    }
  };

  const setBuiltInSelection = () => {
    resetField("accentColor");
    setValue("accentColorSelection", "built-in");
  };

  return (
    <RadioRoot
      className="x:flex x:max-w-md x:flex-wrap x:items-center x:gap-3"
      value={selectedColor}
      orientation="horizontal"
      onValueChange={({ value }) => handleValueChange(value || "")}
    >
      {allColors.map((option, index) => (
        <ColorOption
          key={`${option.value}-${index}`}
          option={option}
          isSelected={
            selectedColor === option.value &&
            accentColorSelection === "built-in"
          }
          onClick={setBuiltInSelection}
        />
      ))}

      <ActionOption
        value="custom"
        icon={<FaPalette />}
        tooltip="Create custom color"
        isSelected={accentColorSelection === "custom"}
      />

      <ActionOption
        value="default"
        icon={<FaTimesCircle />}
        tooltip="No color modification"
        isSelected={accentColorSelection === "default"}
      />
    </RadioRoot>
  );
}
