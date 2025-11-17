import { useField, useStore } from "@tanstack/react-form";

import Tooltip from "@/components/Tooltip";
import {
  RadioRoot,
  RadioItem,
  RadioItemControl,
  RadioItemHiddenInput,
} from "@/components/ui/radio";
import { useThemeFormContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/ThemeFormContext";
import {
  cometColors,
  cplxColors,
  type BuiltInColorValue,
  type ColorPalette,
} from "@/entrypoints/core-plugins/custom-themes/themes/built-in-colors";

import TablerCircleXFilled from "~icons/tabler/circle-x-filled";
import TablerPaletteFilled from "~icons/tabler/palette-filled";

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
  const { form } = useThemeFormContext();

  const accentColorSelectionField = useField({
    form,
    name: "accentColorSelection",
  });

  const selectedColor = useStore(
    form.store,
    (store) => store.values.builtInAccentColor,
  );

  const allColors = [...cplxColors, ...cometColors] as ColorPalette[];

  const handleColorSelect = (color: BuiltInColorValue) => {
    form.setFieldValue("builtInAccentColor", color);
  };

  const handleValueChange = (value: string) => {
    if (value === "custom" || value === "default") {
      form.resetField("accentColor");
      accentColorSelectionField.handleChange(value);
      return;
    }

    if (value) {
      handleColorSelect(value as BuiltInColorValue);
    }
  };

  const setBuiltInSelection = () => {
    form.resetField("accentColor");
    accentColorSelectionField.handleChange("built-in");
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
            accentColorSelectionField.state.value === "built-in"
          }
          onClick={setBuiltInSelection}
        />
      ))}

      <ActionOption
        value="custom"
        icon={<TablerPaletteFilled />}
        tooltip="Create custom color"
        isSelected={accentColorSelectionField.state.value === "custom"}
      />

      <ActionOption
        value="default"
        icon={<TablerCircleXFilled />}
        tooltip="No color modification"
        isSelected={accentColorSelectionField.state.value === "default"}
      />
    </RadioRoot>
  );
}
