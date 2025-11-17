import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { betterSidebarNormalizeCssResourceConfig } from "@/plugins/better-sidebar/index.remote-resources";
import { insertCss } from "@/utils/dom-utils/generics";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "betterSidebar:hideNativeSidebar": void;
  }
}

const normalizeCss = await getVersionedRemoteResource(
  betterSidebarNormalizeCssResourceConfig,
  persistentQueryClient,
);

export default function () {
  AsyncLoaderRegistry.register({
    id: "betterSidebar:hideNativeSidebar",
    dependencies: ["cache:pluginsEnableStatesV2", "store:pluginGuards"],
    loader: async ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["betterSidebar"]) return;

      insertCss({
        css: normalizeCss,
        id: "better-sidebar-normalize",
      });
    },
  });
}
