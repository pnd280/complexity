import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import AccentColorSelector from "@/cplx-user-settings/components/AccentColorSelector";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import Button from "@/shared/components/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/Form";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import ChromeStorage from "@/utils/ChromeStorage";
import { jsonUtils } from "@/utils/utils";

const schema = z.object({
  slogan: z.string().optional(),
  uiFont: z.string().optional(),
  monoFont: z.string().optional(),
  accentColor: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^#[0-9A-F]{6}$/i.test(value);
      },
      {
        message: "Invalid hex color",
      },
    ),
  customCSS: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CustomTheme() {
  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ["customTheme"],
    queryFn: () => ChromeStorage.getStorageValue("customTheme"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slogan: "",
      uiFont: "",
      monoFont: "",
      accentColor: "",
      customCSS: "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = form;

  const [saveButtonText, setSaveButtonText] = useToggleButtonText({
    defaultText: "Save",
  });

  const onSubmit = async (data: FormData) => {
    ChromeStorage.setStorageValue({
      key: "customTheme",
      value: {
        ...data,
        customCSS: JSON.stringify(data.customCSS),
      },
    });

    CplxUserSettings.fetch();

    setSaveButtonText(<Check className="tw-mr-2 tw-h-4 tw-w-4" />);

    reset(data);
  };

  useEffect(() => {
    if (isLoading) return;

    if (savedSettings) {
      reset({
        slogan: savedSettings.slogan || "",
        uiFont: savedSettings.uiFont || "",
        monoFont: savedSettings.monoFont || "",
        accentColor: savedSettings.accentColor || "",
        customCSS:
          (jsonUtils.safeParse(savedSettings.customCSS || "") as string) || "",
      });
    }
  }, [savedSettings, isLoading, reset]);

  return (
    <Form {...form}>
      <form
        className="tw-flex tw-flex-col tw-gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="slogan" className="tw-text-base">
                Custom slogan/heading
              </FormLabel>
              <FormControl>
                <Input
                  id="slogan"
                  placeholder="Where knowledge begins"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="tw-flex tw-gap-2">
          <FormField
            control={form.control}
            name="uiFont"
            render={({ field }) => (
              <FormItem className="tw-w-full">
                <FormLabel htmlFor="ui-font" className="tw-text-base">
                  Custom fonts
                </FormLabel>
                <FormControl>
                  <Input id="ui-font" placeholder="sans" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monoFont"
            render={({ field }) => (
              <FormItem className="tw-w-full tw-self-end">
                <FormControl>
                  <Input placeholder="mono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="accent-color" className="tw-text-base">
                Custom accent color
              </FormLabel>
              <FormControl>
                <AccentColorSelector
                  color={field.value}
                  {...field}
                  setColor={(color) =>
                    setValue("accentColor", color, {
                      shouldDirty: true,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customCSS"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="custom-css" className="tw-text-base">
                Custom CSS
              </FormLabel>
              <FormControl>
                <Textarea
                  id="custom-css"
                  placeholder="Put your CSS code here..."
                  className="tw-h-[300px] tw-resize-none !tw-font-mono"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!isDirty} type="submit">
          {saveButtonText}
        </Button>
      </form>
    </Form>
  );
}
