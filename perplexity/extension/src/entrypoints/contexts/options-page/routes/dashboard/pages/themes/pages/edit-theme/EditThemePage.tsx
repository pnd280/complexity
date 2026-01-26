import { Link, useLoaderData } from "react-router-dom";

import { EditThemeProvider } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/edit-theme/context";
import ThemeForm from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/edit-theme/ThemeForm";
import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import { invariant } from "@/utils/misc/utils";

import TablerChevronLeft from "~icons/tabler/chevron-left";

export function EditThemePage() {
  const theme = useLoaderData<Theme | undefined>();

  invariant(theme != null, "[EditThemePage] Invalid context");

  return (
    <div className="x:max-w-3xl x:space-y-6">
      <Link
        to="/themes"
        className="x:mb-4 x:flex x:items-center x:gap-2 x:text-muted-foreground x:transition x:hover:text-foreground"
      >
        <TablerChevronLeft />
        Back to themes
      </Link>
      <div>
        <h1 className="x:mb-2 x:text-2xl x:font-bold">Editing Theme</h1>
      </div>
      <EditThemeProvider theme={theme}>
        <ThemeForm />
      </EditThemeProvider>
    </div>
  );
}
