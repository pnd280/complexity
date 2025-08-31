import { lazily } from "react-lazily";
import type { RouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import { BUILTIN_THEME_REGISTRY } from "@/data/dashboard/themes/built-in-themes";
import Page from "@/entrypoints/options-page/components/Page";
import { getLocalThemesService } from "@/plugins/_core/custom-theme/index.public";

const { CreateThemePage } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/themes/pages/create-theme/CreateThemePage"
    ),
);

const { EditThemePage } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/themes/pages/edit-theme/EditThemePage"
    ),
);

const { ThemesListing } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/themes/pages/ThemesListing"
    ),
);

export const ThemesPageRoutes: RouteObject[] = [
  {
    path: "new",
    element: <Page title="Create Custom Theme" page={CreateThemePage} />,
  },
  {
    path: ":themeId",
    children: [
      {
        index: true,
        loader: async ({ params }) => {
          const { themeId } = params;

          if (!themeId) return redirect("/themes");

          const localTheme = await getLocalThemesService().get(themeId);

          if (!localTheme) return redirect("/themes");

          return redirect(`/themes/${themeId}/edit`);
        },
      },
      {
        path: "edit",
        id: "editTheme",
        loader: async ({ params }) => {
          const { themeId } = params;

          if (!themeId) return redirect("/themes");

          const builtInTheme = BUILTIN_THEME_REGISTRY.find(
            (theme) => theme.id === themeId,
          );

          if (builtInTheme) return redirect("/themes");

          const localTheme = await getLocalThemesService().get(themeId);

          if (!localTheme) return redirect("/themes");

          return localTheme;
        },
        element: <Page title="Edit Custom Theme" page={EditThemePage} />,
      },
    ],
  },
  {
    index: true,
    element: <Page title="Themes" page={ThemesListing} />,
  },
];
