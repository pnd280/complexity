import { APP_CONFIG } from "@/app.config";
import { settingsStorage } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Home/update-announcer/settings";

export default function () {
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (APP_CONFIG.IS_DEV) return;

    if (details.reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    void settingsStorage.setValue(false);
  });
}
