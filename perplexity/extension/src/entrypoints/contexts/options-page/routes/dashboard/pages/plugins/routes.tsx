import { redirect, type RouteObject } from "react-router-dom";

import PluginSettingsWrapper from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsWrapper";
import IndexPage from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/IndexPage";
import { getPublicPluginManifests } from "@/entrypoints/services/plugins/utils";

export const pluginPageRoutes: RouteObject[] = [
  {
    path: "",
    element: <IndexPage />,
    children: [
      {
        path: ":pluginRouteSegment/*",
        id: "plugin-settings",
        loader: ({ params }) => {
          const pluginRouteSegment = params.pluginRouteSegment;

          const plugin = Object.values(getPublicPluginManifests()).find(
            (manifest) =>
              manifest.dashboardMeta.uiRouteSegment === pluginRouteSegment,
          );

          if (!plugin) {
            return redirect("/plugins");
          }

          return plugin;
        },
        element: <PluginSettingsWrapper />,
      },
    ],
  },
];
