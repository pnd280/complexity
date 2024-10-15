import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import BackgroundScript, {
  BackgroundScriptMessage,
} from "@/utils/BackgroundScript";

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.tabs.create({
      url: BackgroundScript.getOptionsPageUrl() + "?tab=changelog",
    });
  }
});

browser.runtime.onInstalled.addListener(async () => {
  CplxUserSettings.init();
});

browser.runtime.onMessage.addListener(async (unknMessage, sender) => {
  const message = unknMessage as BackgroundScriptMessage;

  switch (message.action) {
    case "openExtensionPage":
      browser.tabs.create({
        url: BackgroundScript.getOptionsPageUrl() + message.payload,
      });
      break;
    case "openChangelog":
      browser.tabs.create({
        url: BackgroundScript.getOptionsPageUrl() + "?tab=changelog",
      });
      break;
    case "openCustomTheme":
      browser.tabs.create({
        url: BackgroundScript.getOptionsPageUrl() + "?tab=customTheme",
      });
      break;
    case "getTabId":
      if (sender.tab) {
        return sender.tab.id;
      }
      break;
  }
  return true;
});

browser.action.onClicked.addListener(() => {
  browser.tabs.create({
    url: "https://perplexity.ai",
  });
});
