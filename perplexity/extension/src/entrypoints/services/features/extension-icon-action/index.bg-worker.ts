import { settingsStorage } from "@/entrypoints/services/features/extension-icon-action/settings";

export default function () {
  chrome.action.onClicked.addListener(async () => {
    const action = await settingsStorage.getValue();

    switch (action) {
      case "perplexity":
        void chrome.tabs.create({ url: "https://perplexity.ai/" });
        break;
      case "dashboard":
        void chrome.runtime.openOptionsPage();
        break;
    }
  });
}
