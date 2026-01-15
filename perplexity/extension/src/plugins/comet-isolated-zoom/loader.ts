import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { BgUtilsService } from "@/entrypoints/services/features/bg-utils/service-init.bg-worker";
import { settingsStorage } from "@/plugins/comet-isolated-zoom/settings";
import { sendMessage } from "@/types/chrome-runtime-message";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:comet:isolatedZoom": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "plugin:comet:isolatedZoom",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
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
          await BgUtilsService.Instance.setTabZoom({
            tabId,
            zoom: currentZoom,
          });

          await settingsStorage.updateValue((draft) => {
            draft.zoomLevel = currentZoom;
          });

          console.log("Zoom set to:", currentZoom);
        } catch (error) {
          console.error("Failed to set tab zoom:", error);
        }
      }

      void setZoom((await settingsStorage.getValue()).zoomLevel);

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
