import { APP_CONFIG } from "@/app.config";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export default function () {
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (APP_CONFIG.IS_DEV) return;

    if (details == null) return;

    if (details.reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    void ExtensionSettingsService.set((draft) => {
      draft.isPostUpdateReleaseNotesPopupDismissed = false;
    });
  });
}
