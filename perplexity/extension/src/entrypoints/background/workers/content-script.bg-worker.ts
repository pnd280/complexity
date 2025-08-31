import { onMessage } from "webext-bridge/background";

import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/utils";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:getTabId": () => number;
    "bg:comet:getSidecarTabId": () => number | undefined;
    "bg:setTabZoom": ({ zoom }: { zoom: number }) => void;
    "bg:openDirectReleaseNotes": ({ version }: { version: string }) => void;
    "bg:openOptionsPage": () => void;
    "bg:notify": ({ data }: { data: any }) => boolean;
  }
}

export default function () {
  onMessage("bg:getTabId", ({ sender }) => sender.tabId);

  onMessage("bg:comet:getSidecarTabId", async ({ sender }) => {
    const tabId = sender.tabId;

    if (!tabId) return;

    const windowId = (await chrome.tabs.get(tabId)).windowId;

    if (windowId == null) return;

    const window = await chrome.windows.get(windowId);

    if (window == null) return;

    return (window as any).sidecarTabId as number | undefined;
  });

  onMessage("bg:openOptionsPage", () => {
    chrome.runtime.openOptionsPage();
  });

  onMessage("bg:openDirectReleaseNotes", ({ data: { version } }) => {
    const optionsPageUrl = getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV });

    chrome.tabs.create({
      url: `${optionsPageUrl}#/direct-release-notes?version=${version}`,
    });
  });

  onMessage("bg:setTabZoom", ({ sender, data }) => {
    const { zoom } = data;
    const tabId = sender.tabId;

    if (!tabId) return;

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
  });
}
