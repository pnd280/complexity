import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
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

      window.addEventListener("spaRouter:route-change", () => {
        handlePromptSave({ url: window.location.pathname, type: "soft" });
      });

      window.addEventListener("beforeunload", () => {
        handlePromptSave({ url: window.location.pathname, type: "hard" });
      });
    },
  });
}
