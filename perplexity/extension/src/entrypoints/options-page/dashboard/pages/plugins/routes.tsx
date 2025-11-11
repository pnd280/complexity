import { redirect, type RouteObject } from "react-router-dom";

import { PluginManifestsRegistry } from "@/__registries__/plugins";
import PluginSettingsWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsWrapper";
import IndexPage from "@/entrypoints/options-page/dashboard/pages/plugins/IndexPage";

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

          const plugin = Object.values(PluginManifestsRegistry.meta).find(
            (p) => p.dashboardMeta.uiRouteSegment === pluginRouteSegment,
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
