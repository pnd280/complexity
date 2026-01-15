import { spaRouterRouteChangeEvent } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/listeners.loader";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { handlePromptSave } from "@/plugins/prompt-history/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:listeners": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:listeners",
    dependencies: ["cache:pluginsEnableStates", "cache:pluginSettingSnapshots"],
    loader: ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:pluginSettingSnapshots": pluginSettingSnapshots,
    }) => {
      if (
        !pluginsEnableStates["promptHistory"] ||
        !pluginSettingSnapshots["promptHistory"].trigger.onNavigation
      )
        return;

      window.addEventListener(spaRouterRouteChangeEvent, () => {
        void handlePromptSave({ url: window.location.pathname, type: "soft" });
      });

      window.addEventListener("beforeunload", () => {
        void handlePromptSave({ url: window.location.pathname, type: "hard" });
      });
    },
  });
}
