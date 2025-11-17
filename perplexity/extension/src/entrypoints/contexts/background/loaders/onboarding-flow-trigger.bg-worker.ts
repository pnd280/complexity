import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/misc/utils";

export default function () {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (APP_CONFIG.IS_DEV) {
      return;
    }
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      void chrome.tabs.create({
        url: `${getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV })}#/onboarding`,
      });
    }
  });
}
