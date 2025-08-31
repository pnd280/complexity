import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:customThreadContainerWidth": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:thread:customThreadContainerWidth",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["thread:customThreadContainerWidth"]) return;

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
