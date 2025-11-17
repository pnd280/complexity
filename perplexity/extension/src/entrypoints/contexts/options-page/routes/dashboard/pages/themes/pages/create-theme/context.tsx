import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type z from "zod";

import { toast } from "@/components/ui/use-toast";
import { ThemeFormContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/ThemeFormContext";
import { useBaseThemeForm } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/useBaseThemeForm";
import { LocalThemesService } from "@/entrypoints/core-plugins/custom-themes/indexed-db/service-init.bg-worker";
import { ThemeFormSchema } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import {
  generateThemeData,
  initialThemeFormValues,
} from "@/entrypoints/core-plugins/custom-themes/themes/utils";
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
