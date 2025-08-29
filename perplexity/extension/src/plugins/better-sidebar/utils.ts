import { ExtensionSettingsService } from "@/services/infra/extension-settings";
import { InstantCssService } from "@/services/features/instant-css";

export async function shouldPreventLayoutShift() {
  return (
    (await InstantCssService.hasPermissions()) &&
    ExtensionSettingsService.cachedSync.plugins.betterSidebar
      .shouldPreventLayoutShift
  );
}
