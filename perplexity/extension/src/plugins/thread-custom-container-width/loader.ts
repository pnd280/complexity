import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { threadCustomContainerWidthCssResourceConfig } from "@/plugins/thread-custom-container-width/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { insertCss } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
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

      const { value } =
        ExtensionSettingsService.cachedSync.plugins[
          "thread:customThreadContainerWidth"
        ];

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
