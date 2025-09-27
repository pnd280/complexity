import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { betterSidebarNormalizeCssResourceConfig } from "@/plugins/better-sidebar/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { insertCss } from "@/utils/dom-utils/generics";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "betterSidebar:hideNativeSidebar": void;
  }
}

const normalizeCss = await getVersionedRemoteResource(
  betterSidebarNormalizeCssResourceConfig,
);

export default function () {
  asyncLoaderRegistry.register({
    id: "betterSidebar:hideNativeSidebar",
    dependencies: ["cache:pluginsStates", "store:pluginGuards"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["betterSidebar"]) return;

      insertCss({
        css: normalizeCss,
        id: "better-sidebar-normalize",
      });
    },
  });
}
