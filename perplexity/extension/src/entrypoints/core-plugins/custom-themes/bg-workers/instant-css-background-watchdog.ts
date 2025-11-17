import { settingsStorage } from "@/entrypoints/core-plugins/custom-themes/settings";
import { getThemeCss } from "@/entrypoints/core-plugins/custom-themes/utils";
import { InstantCssStorageService } from "@/entrypoints/services/features/instant-css/storage/service-init.bg-worker";

const instantCssServiceKey = "customTheme";

let unwatch: (() => void) | null = null;

export async function initInstantCssBackgroundWatchdog() {
  await updateRegistry((await settingsStorage.getValue()).themeId);
  unwatch = settingsStorage.storageItem.watch(({ themeId }) =>
    updateRegistry(themeId),
  );
}

export async function removeInstantCssBackgroundWatchdog() {
  unwatch?.();
}

export async function updateRegistry(
  currentThemeId: Awaited<
    ReturnType<typeof settingsStorage.getValue>
  >["themeId"],
) {
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
