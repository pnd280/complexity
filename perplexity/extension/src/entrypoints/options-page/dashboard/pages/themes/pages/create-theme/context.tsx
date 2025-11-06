import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type z from "zod";

import { toast } from "@/components/ui/use-toast";
import { ThemeFormSchema } from "@/data/dashboard/themes/theme.types";
import {
  generateThemeData,
  initialThemeFormValues,
} from "@/data/dashboard/themes/utils";
import { ThemeFormContext } from "@/entrypoints/options-page/dashboard/pages/themes/context/ThemeFormContext";
import { useBaseThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/context/useBaseThemeForm";
import { LocalThemesService } from "@/plugins/__core__/custom-theme/indexed-db/service-init.bg-worker";
import { safeMerge } from "@/utils/misc/safe-merge";

type CreateThemeProviderProps = {
  children: React.ReactNode;
};

export function CreateThemeProvider({ children }: CreateThemeProviderProps) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "create"],
    mutationFn: async (data: z.input<typeof ThemeFormSchema>) => {
      const themeData = generateThemeData(data);
      const savedThemeId = await LocalThemesService.Instance.add({
        ...themeData,
        id: `${Date.now()}-${data.title.toLowerCase().replace(/ /g, "-")}`,
        description: "",
        config: safeMerge(ThemeFormSchema, data, initialThemeFormValues),
      });

      return savedThemeId;
    },
    onSuccess: () => {
      void navigate("..");
      toast({
        title: "✅ Theme created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to create theme",
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

  const form = useBaseThemeForm(
    initialThemeFormValues,
    async (data: z.input<typeof ThemeFormSchema>) => {
      await mutateAsync(data);
    },
  );

  return (
    <ThemeFormContext
      value={{
        form,
        isPending,
      }}
    >
      {children}
    </ThemeFormContext>
  );
}
