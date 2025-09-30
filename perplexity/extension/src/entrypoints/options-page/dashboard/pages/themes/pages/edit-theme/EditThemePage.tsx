import { LuChevronLeft } from "react-icons/lu";
import { Link, useLoaderData } from "react-router-dom";

import type { Theme } from "@/data/dashboard/themes/theme.types";
import { ThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeForm";
import { EditThemeProvider } from "@/entrypoints/options-page/dashboard/pages/themes/context";
import { invariant } from "@/utils/misc/utils";

export function EditThemePage() {
  const theme = useLoaderData<Theme | undefined>();

  invariant(theme != null, "[EditThemePage] Invalid context");

  return (
    <EditThemeProvider theme={theme}>
      <div className="x:max-w-3xl x:space-y-6">
        <Link
          to="/themes"
          className="x:mb-4 x:flex x:items-center x:gap-2 x:text-muted-foreground x:transition x:hover:text-foreground"
        >
          <LuChevronLeft />
          Back to themes
        </Link>
        <div>
          <h1 className="x:mb-2 x:text-2xl x:font-bold">Editing Theme</h1>
        </div>
        <ThemeForm />
      </div>
    </EditThemeProvider>
  );
}
