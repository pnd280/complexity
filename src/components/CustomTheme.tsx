import {
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { chromeStorage } from '@/utils/chrome-store';
import { jsonUtils } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';

import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

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
        message: 'Invalid hex color',
      }
    ),
  customCSS: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CustomTheme() {
  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ['customTheme'],
    queryFn: () => chromeStorage.getStorageValue('customTheme'),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form;

  const [saveButtonText, setSaveButtonText] = useState<ReactNode>('Save');

  const onSubmit = async (data: FormData) => {
    console.log(data);

    chromeStorage.setStorageValue({
      key: 'customTheme',
      value: {
        ...data,
        customCSS: JSON.stringify(data.customCSS),
      },
    });

    setSaveButtonText(<Check className="tw-h-4 tw-w-4 tw-mr-2" />);

    setTimeout(() => {
      setSaveButtonText('Save');
    }, 2000);
  };

  useEffect(() => {
    if (isLoading) return;

    if (savedSettings) {
      reset({
        slogan: savedSettings.slogan || '',
        uiFont: savedSettings.uiFont || '',
        monoFont: savedSettings.monoFont || '',
        accentColor: savedSettings.accentColor || '',
        customCSS: jsonUtils.safeParse(savedSettings.customCSS || '') || '',
      });
    }
  }, [savedSettings, isLoading, reset]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="tw-flex tw-flex-col tw-gap-4"
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
                  <Input id="ui-font" placeholder="Karla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monoFont"
            render={({ field }) => (
              <FormItem className="tw-self-end tw-w-full">
                <FormControl>
                  <Input placeholder="JetBrains Mono" {...field} />
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
                <div className="tw-flex tw-gap-2">
                  <div
                    className="tw-w-[30%] tw-self-stretch tw-rounded-md tw-border tw-border-border tw-transition-all"
                    style={{
                      backgroundColor: field.value || '#72aefd',
                    }}
                  />
                  <Input id="accent-color" placeholder="#72aefd (default dark)" {...field} />
                </div>
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
                  className="tw-font-mono tw-h-[300px] tw-resize-none"
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
