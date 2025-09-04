import { getThemeCss } from "@/plugins/_core/custom-theme/utils";
import { ExtensionSettingsService } from "@/services/extension-settings";
import type { ExtensionSettings } from "@/services/extension-settings/types";
import { InstantCssStorage } from "@/services/instant-css/storage.proxy-service";

export const instantCssServiceKey = "customTheme";

let unwatch: () => void;

export async function initBackgroundWatchdog() {
  await updateRegistry(await ExtensionSettingsService.storageItem.getValue());
  unwatch = ExtensionSettingsService.storageItem.watch(updateRegistry);
}

export async function removeBackgroundWatchdog() {
  unwatch?.();
}

export const updateRegistry = async (settings?: ExtensionSettings) => {
  const currentThemeId = (settings ?? (await ExtensionSettingsService.get()))
    .theme;

  if (currentThemeId == null || currentThemeId.length === 0) {
    await InstantCssStorage.unregister(instantCssServiceKey);
    return;
  }

  const currentThemeCss = await getThemeCss(currentThemeId);

  const instantCssRegistry = await InstantCssStorage.get();

  if (
    instantCssRegistry[instantCssServiceKey] == null ||
    instantCssRegistry[instantCssServiceKey].css !== currentThemeCss
  ) {
    await InstantCssStorage.register({
      id: instantCssServiceKey,
      css: currentThemeCss,
    });
  }
};
