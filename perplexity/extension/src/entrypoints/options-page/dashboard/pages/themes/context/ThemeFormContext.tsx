import type { UseFormReturn } from "react-hook-form";

import type { ThemeFormValues } from "@/data/dashboard/themes/theme.types";

export type ThemeFormContextType = {
  form: UseFormReturn<ThemeFormValues>;
  isPending: boolean;
  isDeleting?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  deleteTheme?: () => Promise<void>;
  submitText: string;
  footer?: React.ReactNode;
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
