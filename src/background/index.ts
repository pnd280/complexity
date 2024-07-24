import { BackgroundAction } from "@/utils/background";
import ChromeStorage from "@/utils/ChromeStorage";

if (!import.meta.env.DEV) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("/page/options.html") + "?tab=changelog",
    });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await ChromeStorage.getStore();

  if (!settings || Object.keys(settings).length === 0) {
    console.log("First time install detected, setting default values.");

    ChromeStorage.setStore({
      customTheme: {},
      defaultFocus: "internet",
      defaultWebAccess: false,
      secretMode: false,
      popupSettings: {
        queryBoxSelectors: {
          focus: false,
          languageModel: false,
          imageGenModel: false,
          collection: false,
        },
        qolTweaks: {
          threadTOC: false,
          threadMessageStickyToolbar: false,
          alternateMarkdownBlock: false,
          canvas: {
            enabled: false,
            mask: {},
          },
          autoRefreshSessionTimeout: false,
          blockTelemetry: false,
        },
        visualTweaks: {
          collapseEmptyThreadVisualColumns: false,
        },
      },
    });
  }
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
