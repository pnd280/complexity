import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { ContentScriptBgUtilsService } from "@/services/features/content-script-utils/service-init.bg-worker";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { sendMessage } from "@/types/chrome-runtime-message";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:comet:isolatedZoom": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "plugin:comet:isolatedZoom",
    dependencies: ["cache:pluginsEnableStates", "cache:extensionSettings"],
    loader: async ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (!pluginsEnableStates["comet:isolatedZoom"]) return;

      if (whereAmI() !== "comet_assistant") return;

      const tabId = await sendMessage("getTabId");

      invariant(tabId, "[CometIsolatedZoom] Invalid context");

      let currentZoom = 1;

      async function setZoom(zoomLevel?: number, step: number = 0) {
        if (typeof zoomLevel === "number") {
          currentZoom = zoomLevel;
        } else {
          currentZoom = Math.max(0.25, Math.min(5, currentZoom + step));
        }

        try {
          await ContentScriptBgUtilsService.Instance.setTabZoom({
            tabId,
            zoom: currentZoom,
          });

          console.log("Zoom set to:", currentZoom);
          void ExtensionSettingsService.set((draft) => {
            draft.plugins["comet:isolatedZoom"].zoomLevel = currentZoom;
          });
        } catch (error) {
          console.error("Failed to set tab zoom:", error);
        }
      }

      void setZoom(extensionSettings.plugins["comet:isolatedZoom"].zoomLevel);

      $(document).on("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "0") {
          e.preventDefault();
          void setZoom(1, 0);
        }
      });

      document.addEventListener(
        "wheel",
        (e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
              void setZoom(undefined, 0.25);
            } else if (e.deltaY > 0) {
              void setZoom(undefined, -0.25);
            }
          }
        },
        { passive: false },
      );
    },
  });
}
