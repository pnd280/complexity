import { getThemeCss } from "@/plugins/__core__/custom-theme/utils";
import { InstantCssStorageService } from "@/services/features/instant-css/storage/service-init.bg-worker";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/service-init.bg-worker";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

const instantCssServiceKey = "customTheme";

let unwatch: (() => void) | null = null;

export async function initInstantCssBackgroundWatchdog() {
  await updateRegistry(
    await ExtensionSettingsStorageService.Instance.getValue(),
  );
  unwatch =
    ExtensionSettingsStorageService.Root.storageItem.watch(updateRegistry);
}

export async function removeInstantCssBackgroundWatchdog() {
  unwatch?.();
}

export async function updateRegistry(settings?: ExtensionSettings) {
  const currentThemeId = (settings ?? (await ExtensionSettingsService.get()))
    .theme;

  if (currentThemeId.length === 0) {
    await InstantCssStorageService.Instance.unregister(instantCssServiceKey);
    return;
  }

  const currentThemeCss = await getThemeCss(currentThemeId);

  const instantCssRegistry = await InstantCssStorageService.Instance.get();

  if (
    instantCssRegistry[instantCssServiceKey] == null ||
    instantCssRegistry[instantCssServiceKey].css !== currentThemeCss
  ) {
    await InstantCssStorageService.Instance.register({
      id: instantCssServiceKey,
      css: currentThemeCss,
    });
  }
}
