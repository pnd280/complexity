import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getContentScriptBgUtilsService } from "@/services/features/content-script-utils/service-init.bg-worker";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { sendMessage } from "@/types/chrome-runtime-message";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:comet:isolatedZoom": void;
  }
}

export default async function loader() {
  const tabId = await sendMessage("getTabId");

  invariant(tabId, "Can not get tab id");

  let currentZoom = 1;

  async function setZoom(zoomLevel?: number, step: number = 0) {
    if (typeof zoomLevel === "number") {
      currentZoom = zoomLevel;
    } else {
      currentZoom = Math.max(0.25, Math.min(5, currentZoom + step));
    }

    try {
      await getContentScriptBgUtilsService().setTabZoom({
        tabId,
        zoom: currentZoom,
      });

      console.log("Zoom set to:", currentZoom);
      ExtensionSettingsService.set((draft) => {
        draft.plugins["comet:isolatedZoom"].zoomLevel = currentZoom;
      });
    } catch (error) {
      console.error("Failed to set tab zoom:", error);
    }
  }

  asyncLoaderRegistry.register({
    id: "plugin:comet:isolatedZoom",
    dependencies: ["cache:pluginsStates", "cache:extensionSettings"],
    loader: async ({
      "cache:pluginsStates": pluginsStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (!pluginsStates["comet:isolatedZoom"]) return;

      if (whereAmI() !== "comet_assistant") return;

      setZoom(extensionSettings?.plugins["comet:isolatedZoom"].zoomLevel);

      $(document).on("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "0") {
          e.preventDefault();
          setZoom(1, 0);
        }
      });

      $(document).on("wheel", (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const wheelEvent = e.originalEvent as WheelEvent | undefined;
          if (wheelEvent) {
            if (wheelEvent.deltaY < 0) {
              setZoom(undefined, 0.25);
            } else if (wheelEvent.deltaY > 0) {
              setZoom(undefined, -0.25);
            }
          }
        }
      });
    },
  });
}
