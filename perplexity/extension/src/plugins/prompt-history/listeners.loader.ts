import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { spaRouterRouteChangeEvent } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { handlePromptSave } from "@/plugins/prompt-history/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:listeners": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:listeners",
    dependencies: ["cache:pluginsStates", "cache:extensionSettings"],
    loader: ({
      "cache:pluginsStates": pluginsStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (
        !pluginsStates["slashCommand"] ||
        !pluginsStates["promptHistory"] ||
        !extensionSettings.plugins["promptHistory"].trigger.onNavigation
      )
        return;

      window.addEventListener(spaRouterRouteChangeEvent, () => {
        handlePromptSave({ url: window.location.pathname, type: "soft" });
      });

      window.addEventListener("beforeunload", () => {
        handlePromptSave({ url: window.location.pathname, type: "hard" });
      });
    },
  });
}
