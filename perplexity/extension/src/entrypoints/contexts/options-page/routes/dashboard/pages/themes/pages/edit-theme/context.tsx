import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, use } from "react";
import { useNavigate } from "react-router-dom";
import type z from "zod";

import { toast } from "@/components/ui/use-toast";
import { ThemeFormContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/ThemeFormContext";
import { useBaseThemeForm } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/useBaseThemeForm";
import { updateRegistry } from "@/entrypoints/core-plugins/custom-themes/bg-workers/instant-css-background-watchdog";
import { LocalThemesService } from "@/entrypoints/core-plugins/custom-themes/indexed-db/service-init.bg-worker";
import { settingsStorage } from "@/entrypoints/core-plugins/custom-themes/settings";
import {
  ThemeFormSchema,
  type Theme,
  type ThemeFormValues,
} from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import { generateThemeData } from "@/entrypoints/core-plugins/custom-themes/themes/utils";
import useSettings from "@/entrypoints/hooks/useSettings";
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

  const { settings } = useSettings(settingsStorage.storageItem);

  const form = useBaseThemeForm(initialValues, async (data) => {
    await mutateAsync(data);
    void updateRegistry(settings.themeId);
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
