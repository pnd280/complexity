import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/misc/utils";

export const backgroundProxyServiceName = "BgUtilsService";

export class BgUtilsServiceImpl {
  static async cometGetSidecarTabId({
    currentTabId,
  }: {
    currentTabId: number;
  }) {
    const windowId = (await chrome.tabs.get(currentTabId)).windowId;

    const window = await chrome.windows.get(windowId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).sidecarTabId as number | undefined;
  }

  static async openOptionsPage() {
    void chrome.runtime.openOptionsPage();
  }

  static async openExtensionsManagementPage() {
    if (APP_CONFIG.BROWSER === "chrome") {
      void chrome.tabs.create({
        url: `chrome://extensions?id=${chrome.runtime.id}`,
      });
    } else {
      // noop, Firefox doesnt allow opening about:* pages
    }
  }

  static async openFullScreenReleaseNotes({ version }: { version: string }) {
    void chrome.tabs.create({
      url: `${getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV })}#/fs-release-notes?version=${version}`,
    });
  }

  static async setTabZoom({ tabId, zoom }: { tabId: number; zoom: number }) {
    chrome.tabs.setZoomSettings(
      tabId,
      {
        mode: "automatic",
        scope: "per-tab",
        defaultZoomFactor: zoom,
      },
      function () {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to set tab zoom settings:",
            JSON.stringify(chrome.runtime.lastError),
          );
          return;
        }

        chrome.tabs.setZoom(tabId, zoom, () => {
          if (chrome.runtime.lastError) {
            console.error(
              "Failed to set tab zoom:",
              JSON.stringify(chrome.runtime.lastError),
            );
          }
        });
      },
    );
  }
}

export type BgUtilsService = typeof BgUtilsServiceImpl;
