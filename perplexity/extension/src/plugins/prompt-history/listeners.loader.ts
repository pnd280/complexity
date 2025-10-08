import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouterRouteChangeEvent } from "@/plugins/__core__/_main-world/spa-router/listeners.loader";
import { handlePromptSave } from "@/plugins/prompt-history/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:listeners": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:listeners",
    dependencies: ["cache:pluginsEnableStates", "cache:extensionSettings"],
    loader: ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (
        !pluginsEnableStates["promptHistory"] ||
        !extensionSettings.plugins["promptHistory"].trigger.onNavigation
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
