import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export default function () {
  chrome.action.onClicked.addListener(async () => {
    const action = (await ExtensionSettingsService.get()).extensionIconAction;

    if (action === "perplexity")
      void chrome.tabs.create({ url: "https://perplexity.ai/" });
    else void chrome.runtime.openOptionsPage();
  });
}
