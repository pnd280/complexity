import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { betterSidebarNormalizeCssResourceConfig } from "@/plugins/better-sidebar/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { insertCss } from "@/utils/dom-utils/generics";

declare module "@/plugins/__async-deps__/async-loaders" {
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
    dependencies: ["cache:pluginsEnableStates", "store:pluginGuards"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["betterSidebar"]) return;

      insertCss({
        css: normalizeCss,
        id: "better-sidebar-normalize",
      });
    },
  });
}
