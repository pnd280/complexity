import { settingsStorage } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/CometNtp/settings";
import { isCometBrowser } from "@/entrypoints/utils/comet";

export default async function () {
  const listener = async (tab: chrome.tabs.Tab) => {
    if (tab.id == null) return;

    const url = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.location.href,
      world: "MAIN",
    });

    if (url[0]?.result !== "https://www.perplexity.ai/b/home") return;

    void chrome.tabs.reload(tab.id);
  };

  const handler = async (enabled: boolean) => {
    chrome.tabs.onCreated.removeListener(listener);

    if (!(await isCometBrowser()) || !enabled) return;

    chrome.tabs.onCreated.addListener(listener);
  };

  void handler(await settingsStorage.getValue());

  settingsStorage.watch(handler);
}
