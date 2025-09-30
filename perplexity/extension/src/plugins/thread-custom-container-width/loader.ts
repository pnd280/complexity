import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:customThreadContainerWidth": void;
  }
}

export default function loader() {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:customThreadContainerWidth",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:customThreadContainerWidth"]) return;

      const { value } =
        ExtensionSettingsService.cachedSync.plugins[
          "thread:customThreadContainerWidth"
        ];

      if (value < 740) return;

      setThreadWidth(whereAmI(), value);

      spaRouteChangeCompleteSubscribe((url) => {
        setThreadWidth(whereAmI(url), value);
      });
    },
  });
}

function setThreadWidth(location: ReturnType<typeof whereAmI>, value: number) {
  const isInThread = location === "thread";

  $(document.body).css("--thread-width", isInThread ? `${value}px` : "");
  $(document.body).css(
    "--thread-content-width",
    isInThread ? `${value}px` : "",
  );
}
