import { useMutation } from "@tanstack/react-query";
import { type DeepRequired } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import type {
  Theme,
  ThemeFormValues,
} from "@/data/dashboard/themes/theme.types";
import {
  ThemeFormContext,
  useThemeFormContext,
  type ThemeFormContextType,
} from "@/entrypoints/options-page/dashboard/pages/themes/context/ThemeFormContext";
import { useBaseThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/hooks/useBaseThemeForm";
import { DeleteButton } from "@/entrypoints/options-page/dashboard/pages/themes/pages/edit-theme/components/DeleteButton";
import {
  getLocalThemesService,
  updateRegistry,
} from "@/plugins/_core/custom-theme/index.public";

type EditThemeProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export function EditThemeProvider({ children, theme }: EditThemeProviderProps) {
  const navigate = useNavigate();

  const initialValues: DeepRequired<ThemeFormValues> = {
    title: theme.title,
    fonts: {
      ui: theme.config?.fonts?.ui ?? "",
      mono: theme.config?.fonts?.mono ?? "",
    },
    accentColor: theme.config?.accentColor ?? "",
    builtInAccentColor: theme.config?.builtInAccentColor ?? "cplx-blue",
    accentColorSelection: theme.config?.accentColorSelection ?? "built-in",
    enhanceThreadTypography: theme.config?.enhanceThreadTypography ?? false,
    customCss: theme.config?.customCss ?? "",
  };

  const { form, generateThemeData } = useBaseThemeForm(initialValues);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "edit", theme.id],
    mutationFn: async (data: ThemeFormValues) => {
      const themeData = generateThemeData(data, initialValues);
      await getLocalThemesService().update({
        ...theme,
        ...themeData,
        config: data,
      });
      return theme;
    },
    onSuccess: (_, variables) => {
      form.reset({
        ...initialValues,
        ...variables,
      });
      toast({
        title: "✅ Theme saved",
        description: "Your theme has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to save theme",
        description: error.message,
      });
    },
  });

  const { mutateAsync: deleteThemeMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: ["customTheme", "delete", theme.id],
      mutationFn: async () => {
        await getLocalThemesService().delete(theme.id);
      },
      onSuccess: () => {
        navigate("..");
        toast({
          title: "✅ Theme deleted",
          description: "Your theme has been deleted successfully",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "❌ Failed to delete theme",
          description: error.message,
        });
      },
    });

  const onSubmit = form.handleSubmit((data) => {
    mutateAsync(data);
    updateRegistry();
  });

  const deleteTheme = () => deleteThemeMutation();

  const value: ThemeFormContextType = {
    form,
    isPending,
    onSubmit,
    deleteTheme,
    isDeleting,
    submitText: "Save Changes",
    footer: <DeleteButtonWrapper />,
  };

  return <ThemeFormContext value={value}>{children}</ThemeFormContext>;
}

function DeleteButtonWrapper() {
  const { deleteTheme, isDeleting } = useThemeFormContext();

  if (!deleteTheme || isDeleting === undefined) {
    return null;
  }

  return <DeleteButton isDeleting={isDeleting} onDelete={deleteTheme} />;
}
