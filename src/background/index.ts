import CplxUserSettings from "@/lib/CplxUserSettings";
import { BackgroundAction } from "@/utils/BackgroundScript";

if (!import.meta.env.DEV) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("/page/options.html") + "?tab=changelog",
    });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  CplxUserSettings.init();
});

chrome.runtime.onMessage.addListener(
  async (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void,
  ) => {
    const action: BackgroundAction = message.action;

    switch (action) {
      case "openChangelog":
        chrome.tabs.create({
          url: chrome.runtime.getURL("/page/options.html") + "?tab=changelog",
        });
        break;
      case "openCustomTheme":
        chrome.tabs.create({
          url: chrome.runtime.getURL("/page/options.html") + "?tab=customTheme",
        });
        break;
      case "getTabId":
        if (sender.tab) {
          sendResponse({ tabId: sender.tab.id });
        }
        break;
    }
    return true;
  },
);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "downloadSVG") {
    chrome.downloads.download({
      filename: message.fileName,
      url: `data:image/svg+xml;base64,${message.data}`,
      saveAs: true,
    });
  }
});
