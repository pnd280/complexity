import { ExtensionSettingsService } from "@/services/infra/extension-settings";

export function toggleZenMode(forceState?: boolean): boolean {
  const previousZenMode = $("body").attr("data-cplx-zen-mode");
  const newZenMode =
    forceState !== undefined
      ? forceState
        ? "true"
        : "false"
      : previousZenMode === "true"
        ? "false"
        : "true";

  $("body").attr("data-cplx-zen-mode", newZenMode);

  if (ExtensionSettingsService.cachedSync?.plugins["zenMode"].persistent) {
    ExtensionSettingsService.set((draft) => {
      draft.plugins["zenMode"].lastState = newZenMode === "true";
    });
  }

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);

  return newZenMode === "true";
}
