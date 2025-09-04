import { zodResolver } from "@hookform/resolvers/zod";
import type { DeepRequired } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
  ThemeFormSchema,
  type ThemeFormValues,
} from "@/data/dashboard/themes/theme.types";
import { generateThemeData } from "@/data/dashboard/themes/utils";

export function useBaseThemeForm(defaultValues: DeepRequired<ThemeFormValues>) {
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(ThemeFormSchema),
    mode: "onChange",
    defaultValues,
  });

  return {
    form,
    generateThemeData,
  };
}
