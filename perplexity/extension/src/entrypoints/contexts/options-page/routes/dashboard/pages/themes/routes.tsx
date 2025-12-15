import { lazily } from "react-lazily";
import type { RouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import Page from "@/entrypoints/contexts/options-page/components/Page";
import { LocalThemesService } from "@/entrypoints/core-plugins/custom-themes/indexed-db/service-init.bg-worker";
import { BUILTIN_THEME_REGISTRY } from "@/entrypoints/core-plugins/custom-themes/themes/built-in-themes";

const { CreateThemePage } = lazily(
  () =>
    import("@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/create-theme/CreateThemePage"),
);

const { EditThemePage } = lazily(
  () =>
    import("@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/edit-theme/EditThemePage"),
);

const { ThemesListing } = lazily(
  () =>
    import("@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/ThemesListing"),
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

          const localTheme = await LocalThemesService.Instance.get(themeId);

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

          const localTheme = await LocalThemesService.Instance.get(themeId);

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
