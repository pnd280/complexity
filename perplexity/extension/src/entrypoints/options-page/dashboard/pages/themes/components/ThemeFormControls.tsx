import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ColorInput } from "@/entrypoints/options-page/dashboard/pages/themes/components/ColorInput";
import { useThemeFormContext } from "@/entrypoints/options-page/dashboard/pages/themes/context/ThemeFormContext";

export function ThemeFormControls() {
  const { form, isPending } = useThemeFormContext();

  return (
    <>
      <form.Field name="title">
        {(field) => (
          <Field
            data-invalid={
              field.state.meta.isTouched && !field.state.meta.isValid
            }
          >
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              id={field.name}
              placeholder="Enter theme title"
              value={field.state.value}
              disabled={isPending}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="accentColor">
        {(field) => (
          <Field
            data-invalid={
              field.state.meta.isTouched && !field.state.meta.isValid
            }
          >
            <FieldLabel htmlFor={field.name}>Accent Color</FieldLabel>
            <ColorInput />
          </Field>
        )}
      </form.Field>

      <FieldSet>
        <div className="x:flex x:items-center x:gap-4">
          <form.Field name="fonts.ui">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>UI Font</FieldLabel>
                <Input
                  id={field.name}
                  className="x:font-mono"
                  placeholder="ui (e.g., Inter)"
                  value={field.state.value}
                  disabled={isPending}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="fonts.mono">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>Mono Font</FieldLabel>
                <Input
                  id={field.name}
                  className="x:font-mono"
                  placeholder="monospace (e.g., JetBrains Mono, Fira Code)"
                  value={field.state.value}
                  disabled={isPending}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          </form.Field>
        </div>
        <FieldDescription>
          Make sure entered fonts are installed on your system.
        </FieldDescription>
      </FieldSet>

      <form.Field name="enhanceThreadTypography">
        {(field) => {
          const invalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field
              orientation="horizontal"
              data-invalid={invalid}
              className="x:gap-24"
            >
              <FieldContent>
                <FieldLabel>Enhance Typography (in Threads)</FieldLabel>
                <FieldDescription>
                  Emphasizes headings, bold text, make inline code more
                  readable, and remove font ligatures.{" "}
                  <span className="x:font-bold">
                    Require at least one plugin in the &quot;Thread&quot;
                    category to be active.
                  </span>
                </FieldDescription>
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </FieldContent>
              <Switch
                disabled={isPending}
                checked={field.state.value}
                onCheckedChange={({ checked }) => field.handleChange(checked)}
              />
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="customCss">
        {(field) => {
          const invalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor={field.name}>Advanced: CSS</FieldLabel>
              <Textarea
                id={field.name}
                placeholder="Enter custom CSS rules"
                className="x:min-h-[300px] x:font-mono"
                aria-invalid={invalid}
                disabled={isPending}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldDescription>
                Use with caution, badly written CSS can severely affect the
                performance of the page.
              </FieldDescription>
              {invalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
    </>
  );
}
