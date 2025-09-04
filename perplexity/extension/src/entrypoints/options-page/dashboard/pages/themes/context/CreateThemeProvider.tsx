import { useMutation } from "@tanstack/react-query";
import type { DeepRequired } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import type { ThemeFormValues } from "@/data/dashboard/themes/theme.types";
import {
  ThemeFormContext,
  type ThemeFormContextType,
} from "@/entrypoints/options-page/dashboard/pages/themes/context/ThemeFormContext";
import { useBaseThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/hooks/useBaseThemeForm";
import { getLocalThemesService } from "@/plugins/_core/custom-theme/index.public";

type CreateThemeProviderProps = {
  children: React.ReactNode;
};

export function CreateThemeProvider({ children }: CreateThemeProviderProps) {
  const navigate = useNavigate();

  const initialValues: DeepRequired<ThemeFormValues> = {
    title: "Untitled Theme",
    fonts: { ui: "", mono: "" },
    accentColor: "",
    builtInAccentColor: "cplx-blue",
    accentColorSelection: "built-in",
    enhanceThreadTypography: false,
    customCss: "",
  };

  const { form, generateThemeData } = useBaseThemeForm(initialValues);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "create"],
    mutationFn: async (data: ThemeFormValues) => {
      const themeData = generateThemeData(data, initialValues);
      const savedThemeId = await getLocalThemesService().add({
        title: data.title,
        id: `${Date.now()}-${data.title.toLowerCase().replace(/ /g, "-")}`,
        config: data,
        ...themeData,
      });
      return savedThemeId;
    },
    onSuccess: () => {
      navigate("..");
      toast({
        title: "✅ Theme created",
        description: "Your theme has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to create theme",
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutateAsync(data));

  const value: ThemeFormContextType = {
    form,
    isPending,
    onSubmit,
    submitText: "Create Theme",
    footer: null,
  };

  return <ThemeFormContext value={value}>{children}</ThemeFormContext>;
}
