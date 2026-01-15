import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import { threadCustomContainerWidthCssResourceConfig } from "@/plugins/_thread/custom-container-width/index.remote-resources";
import { insertCss } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:customThreadContainerWidth": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:customThreadContainerWidth",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:customThreadContainerWidth"]) return;

      const value = PluginsSettingSnapshotsService.getPluginSnapshot(
        "thread:customThreadContainerWidth",
      ).value;

      if (value < 740) return;

      spaRouteChangeCompleteSubscribe(
        (url) => {
          const location = whereAmI(url);

          $(document.body).css(
            "--thread-content-width",
            location === "thread" ? `${value}px` : "",
          );
        },
        { immediate: true },
      );

      insertCss({
        id: "plugin-thread-customThreadContainerWidth-style",
        css: await getVersionedRemoteResource(
          threadCustomContainerWidthCssResourceConfig,
          persistentQueryClient,
        ),
      });
    },
  });
}
