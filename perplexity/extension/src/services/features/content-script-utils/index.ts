import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/misc/utils";

export const backgroundProxyServiceName = "contentScriptBgUtilsService";

export class ContentScriptBgUtilsServiceImpl {
  static async cometGetSidecarTabId({
    currentTabId,
  }: {
    currentTabId: number;
  }) {
    const windowId = (await chrome.tabs.get(currentTabId)).windowId;

    if (windowId == null) return;

    const window = await chrome.windows.get(windowId);

    if (window == null) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).sidecarTabId as number | undefined;
  }

  static async openOptionsPage() {
    void chrome.runtime.openOptionsPage();
  }

  static async openDirectReleaseNotes({ version }: { version: string }) {
    const optionsPageUrl = getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV });

    void chrome.tabs.create({
      url: `${optionsPageUrl}#/direct-release-notes?version=${version}`,
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

export type ContentScriptBgUtilsService =
  typeof ContentScriptBgUtilsServiceImpl;
