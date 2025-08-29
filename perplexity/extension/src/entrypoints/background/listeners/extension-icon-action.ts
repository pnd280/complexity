import { ExtensionSettingsService } from "@/services/infra/extension-settings";

export function extensionIconActionListener() {
  chrome.action.onClicked.addListener(async () => {
    const action = (await ExtensionSettingsService.get()).extensionIconAction;

    if (action === "perplexity")
      chrome.tabs.create({ url: "https://perplexity.ai/" });
    else chrome.runtime.openOptionsPage();
  });
}
