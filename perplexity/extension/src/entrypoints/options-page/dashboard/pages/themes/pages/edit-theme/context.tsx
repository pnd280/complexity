import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, use } from "react";
import { useNavigate } from "react-router-dom";
import type z from "zod";

import { toast } from "@/components/ui/use-toast";
import {
  ThemeFormSchema,
  type Theme,
  type ThemeFormValues,
} from "@/data/dashboard/themes/theme.types";
import { generateThemeData } from "@/data/dashboard/themes/utils";
import { ThemeFormContext } from "@/entrypoints/options-page/dashboard/pages/themes/context/ThemeFormContext";
import { useBaseThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/context/useBaseThemeForm";
import { LocalThemesService } from "@/plugins/__core__/custom-theme/indexed-db/service-init.bg-worker";
import { updateRegistry } from "@/plugins/__core__/custom-theme/instant-css-background-watchdog";
import { safeMerge } from "@/utils/misc/safe-merge";
import { invariant } from "@/utils/misc/utils";

type EditThemeProviderProps = {
  children: React.ReactNode;
  theme: Theme;
};

export function EditThemeProvider({ children, theme }: EditThemeProviderProps) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const initialValues: ThemeFormValues = {
    title: theme.config.title,
    fonts: {
      ui: theme.config.fonts.ui,
      mono: theme.config.fonts.mono,
    },
    accentColor: theme.config.accentColor,
    builtInAccentColor: theme.config.builtInAccentColor,
    accentColorSelection: theme.config.accentColorSelection,
    enhanceThreadTypography: theme.config.enhanceThreadTypography,
    customCss: theme.config.customCss,
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "edit", theme.id],
    mutationFn: async (data: z.input<typeof ThemeFormSchema>) => {
      const themeData = generateThemeData(data);
      const updatedTheme: Theme = {
        ...theme,
        ...themeData,
        description: "",
        config: safeMerge(ThemeFormSchema, data, initialValues),
      };
      await LocalThemesService.Instance.update(updatedTheme);
      return updatedTheme;
    },
    onSuccess: (updatedTheme) => {
      setTimeout(() => {
        // FIXME: known bug https://github.com/TanStack/form/issues/1681
        form.reset(updatedTheme.config);
      }, 100);

      toast({
        title: "✅ Theme saved",
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Failed to save theme",
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["localThemes"],
        exact: true,
      });
    },
  });

  const form = useBaseThemeForm(initialValues, async (data) => {
    await mutateAsync(data);
    void updateRegistry();
  });

  const { mutateAsync: deleteThemeMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: ["customTheme", "delete", theme.id],
      mutationFn: async () => {
        await LocalThemesService.Instance.delete(theme.id);
      },
      onSuccess: () => {
        void navigate("..");
      },
      onError: (error) => {
        toast({
          title: "❌ Failed to delete theme",
          description: error.message,
        });
      },
    });

  const deleteTheme = () => deleteThemeMutation();

  return (
    <ThemeFormContext value={{ form, isPending }}>
      <EditThemeContext value={{ deleteTheme, isDeleting }}>
        {children}
      </EditThemeContext>
    </ThemeFormContext>
  );
}

type EditThemeContextType = {
  deleteTheme: () => void;
  isDeleting: boolean;
};

export const EditThemeContext = createContext<EditThemeContextType | null>(
  null,
);

export function useEditThemeContext() {
  const context = use(EditThemeContext);

  invariant(
    context != null,
    "useEditThemeContext must be used within an EditThemeProvider",
  );

  return context;
}
