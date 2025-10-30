import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

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

  if (ExtensionSettingsService.cachedSync.plugins["zenMode"].persistent) {
    localStorage.setItem("cplx.zen-mode.last-state", newZenMode);
  }

  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);

  return newZenMode === "true";
}
