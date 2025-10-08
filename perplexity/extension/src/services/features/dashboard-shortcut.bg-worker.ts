import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/misc/utils";

export default function () {
  void chrome.contextMenus.removeAll();

  void chrome.contextMenus.create({
    id: "openOptionsPage",
    title: "Dashboard",
    contexts: ["action"],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openOptionsPage") {
      void chrome.tabs.create({
        url: getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV }),
      });
    }
  });
}
