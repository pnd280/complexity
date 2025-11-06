import { Link } from "react-router-dom";

import { CreateThemeProvider } from "@/entrypoints/options-page/dashboard/pages/themes/pages/create-theme/context";
import ThemeForm from "@/entrypoints/options-page/dashboard/pages/themes/pages/create-theme/ThemeForm";

import TablerChevronLeft from "~icons/tabler/chevron-left";

export function CreateThemePage() {
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
        <h1 className="x:mb-2 x:text-2xl x:font-bold">Create Custom Theme</h1>
        <p className="x:text-muted-foreground">
          Create a custom theme with CSS and predefined options. Leave blank to
          use default values.
        </p>
      </div>
      <CreateThemeProvider>
        <ThemeForm />
      </CreateThemeProvider>
    </div>
  );
}
