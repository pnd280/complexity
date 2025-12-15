import { useField } from "@tanstack/react-form";

import {
  FieldDescription,
  FieldError,
  FieldSet,
} from "@/components/form/field";
import { Input } from "@/components/ui/input";
import BuiltInColorPicker from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ColorInput/BuiltInColorPicker";
import { useThemeFormContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/ThemeFormContext";

export function ColorInput() {
  const { form, isPending } = useThemeFormContext();

  const accentColorSelectionField = useField({
    form,
    name: "accentColorSelection",
  });

  const accentColorField = useField({
    form,
    name: "accentColor",
  });

  const errors = accentColorField.state.meta.errors;

  return (
    <FieldSet>
      <BuiltInColorPicker />
      {accentColorSelectionField.state.value === "custom" && (
        <>
          <div className="x:flex x:items-center x:gap-4">
            <Input
              disabled={isPending}
              type="color"
              className="x:h-10 x:w-14"
              value={accentColorField.state.value || "#000000"}
              tabIndex={-1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                accentColorField.handleChange(e.target.value);
              }}
            />
            <Input
              type="text"
              disabled={isPending}
              className="x:font-mono"
              placeholder="#000000"
              value={accentColorField.state.value}
              maxLength={7}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let newValue = e.target.value;

                if (newValue && !newValue.startsWith("#")) {
                  newValue = `#${newValue}`;
                }

                accentColorField.handleChange(newValue);
              }}
            />
          </div>
          {errors.length > 0 && <FieldError errors={errors} />}
          <FieldDescription className="x:text-sm x:text-muted-foreground">
            Complementary shades will be generated based on the provided color.
          </FieldDescription>
        </>
      )}
    </FieldSet>
  );
}
