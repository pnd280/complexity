import { getThemeCss } from "@/plugins/_core/custom-theme/utils";
import { getInstantCssStorageService } from "@/services/features/instant-css/storage/service-init.bg-worker";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { getExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/service-init.bg-worker";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

const instantCssServiceKey = "customTheme";

let unwatch: () => void;

export async function initInstantCssBackgroundWatchdog() {
  await updateRegistry(await getExtensionSettingsStorageService().getValue());
  unwatch = ExtensionSettingsStorageService.storageItem.watch(updateRegistry);
}

export async function removeInstantCssBackgroundWatchdog() {
  unwatch?.();
}

export async function updateRegistry(settings?: ExtensionSettings) {
  const currentThemeId = (settings ?? (await ExtensionSettingsService.get()))
    .theme;

  if (currentThemeId == null || currentThemeId.length === 0) {
    await getInstantCssStorageService().unregister(instantCssServiceKey);
    return;
  }

  const currentThemeCss = await getThemeCss(currentThemeId);

  const instantCssRegistry = await getInstantCssStorageService().get();

  if (
    instantCssRegistry[instantCssServiceKey] == null ||
    instantCssRegistry[instantCssServiceKey].css !== currentThemeCss
  ) {
    await getInstantCssStorageService().register({
      id: instantCssServiceKey,
      css: currentThemeCss,
    });
  }
}
