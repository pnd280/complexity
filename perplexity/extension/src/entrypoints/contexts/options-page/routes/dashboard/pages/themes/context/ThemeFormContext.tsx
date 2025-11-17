import { createContext, use } from "react";

import type { useBaseThemeForm } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/useBaseThemeForm";
import { invariant } from "@/utils/misc/utils";

export type ThemeFormContextType = {
  form: ReturnType<typeof useBaseThemeForm>;
  isPending: boolean;
};

export const ThemeFormContext = createContext<ThemeFormContextType | null>(
  null,
);

export function useThemeFormContext() {
  const context = use(ThemeFormContext);

  invariant(
    context != null,
    "useThemeFormContext must be used within a ThemeFormProvider",
  );

  return context;
}
