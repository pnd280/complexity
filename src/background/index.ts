import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import BackgroundScript, {
  BackgroundScriptMessage,
} from "@/utils/BackgroundScript";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: BackgroundScript.getOptionsPageUrl() + "?tab=changelog",
    });
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  CplxUserSettings.init();
});

chrome.runtime.onMessage.addListener(async (unknMessage) => {
  const message = unknMessage as BackgroundScriptMessage;

  switch (message.action) {
    case "openExtensionPage":
      chrome.tabs.create({
        url: BackgroundScript.getOptionsPageUrl() + message.payload,
      });
      break;
    case "openChangelog":
      chrome.tabs.create({
        url: BackgroundScript.getOptionsPageUrl() + "?tab=changelog",
      });
      break;
    case "openCustomTheme":
      chrome.tabs.create({
        url: BackgroundScript.getOptionsPageUrl() + "?tab=customTheme",
      });
      break;
  }
  return true;
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "https://perplexity.ai",
  });
});
