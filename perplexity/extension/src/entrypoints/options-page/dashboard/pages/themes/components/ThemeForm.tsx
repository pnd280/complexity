import { Button } from "@/components/ui/button";
import {
  FormProvider,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ColorInput } from "@/entrypoints/options-page/dashboard/pages/themes/components/ColorInput";
import { useThemeFormContext } from "@/entrypoints/options-page/dashboard/pages/themes/context";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export function ThemeForm() {
  const { form, onSubmit, isPending, submitText, footer } =
    useThemeFormContext();

  return (
    <FormProvider {...form}>
      <form className="x:space-y-6" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          disabled={isPending}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="x:text-lg">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter theme title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={isPending}
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormItem>
                  <FormLabel className="x:text-lg">Accent Color</FormLabel>
                  <FormControl>
                    <ColorInput
                      disabled={field.disabled}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormControl>
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="x:text-lg">Font Families</FormLabel>
          <div className="x:grid x:grid-cols-2 x:gap-4">
            <FormField
              control={form.control}
              disabled={isPending}
              name="fonts.ui"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="x:font-mono"
                      placeholder="ui (e.g., Inter)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isPending}
              name="fonts.mono"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="x:font-mono"
                      placeholder="monospace (e.g., JetBrains Mono, Fira Code)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormDescription>
            Make sure entered fonts are installed on your system.
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="enhanceThreadTypography"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className="x:flex x:flex-row x:items-center x:justify-between">
              <div className="x:space-y-0.5">
                <FormLabel className="x:text-lg">
                  Enhance Typography (in Threads)
                </FormLabel>
                <FormDescription>
                  <span className="x:block">
                    Emphasizes headings, bold text, make inline code more
                    readable, and remove font ligatures.
                  </span>
                  <span className="x:block x:font-bold">
                    Require at least one plugin in the "Thread" category to be
                    active.
                  </span>
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={field.disabled}
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={isPending}
          name="customCss"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="x:text-lg">Advanced: CSS</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter custom CSS rules"
                  className="x:min-h-[300px] x:font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Use with caution, badly written CSS can severely affect the
                performance of the page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="x:flex x:justify-end x:gap-2">
          {footer}
          <Button
            type="submit"
            disabled={
              isPending || Object.keys(form.formState.errors).length > 0
            }
          >
            {isPending ? (
              <TablerLoaderCircle className="x:size-4 x:animate-spin" />
            ) : (
              submitText
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
