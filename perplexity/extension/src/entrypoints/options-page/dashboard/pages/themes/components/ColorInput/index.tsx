import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { ThemeFormValues } from "@/data/dashboard/themes/theme.types";
import BuiltInColorPicker from "@/entrypoints/options-page/dashboard/pages/themes/components/ColorInput/BuiltInColorPicker";

type ColorInputProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ColorInput({ value, onChange, disabled }: ColorInputProps) {
  const { watch } = useFormContext<ThemeFormValues>();

  const accentColorSelection = watch("accentColorSelection");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue && !newValue.startsWith("#")) {
      newValue = `#${newValue}`;
    }

    onChange(newValue);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase());
  };

  const inputValue = value ?? "";

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <BuiltInColorPicker />
      {accentColorSelection === "custom" && (
        <div className="x:space-y-2">
          <div className="x:flex x:items-center x:gap-2">
            <Input
              disabled={disabled}
              type="color"
              className="x:h-10 x:w-14"
              value={value || "#000000"}
              tabIndex={-1}
              onChange={handleColorChange}
            />
            <Input
              type="text"
              disabled={disabled}
              className="x:font-mono"
              placeholder="#000000"
              value={inputValue}
              maxLength={7}
              onChange={handleTextChange}
            />
          </div>
          <div className="x:text-sm x:text-muted-foreground">
            Complementary shades will be generated based on the provided color.
          </div>
        </div>
      )}
    </div>
  );
}
