import { revalidateLogic, useForm } from "@tanstack/react-form";
import type z from "zod";

import { ThemeFormSchema } from "@/data/dashboard/themes/theme.types";

export function useBaseThemeForm(
  defaultValues: z.input<typeof ThemeFormSchema>,
  onSubmit: (data: z.input<typeof ThemeFormSchema>) => Promise<void>,
) {
  return useForm({
    defaultValues,
    validators: {
      onSubmit: ThemeFormSchema,
      onDynamic: ThemeFormSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}
