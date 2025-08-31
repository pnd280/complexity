import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/utils";

export default function () {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: `${getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV })}#/onboarding`,
      });
    }
  });
}
