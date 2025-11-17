import { LocalThemesService } from "@/entrypoints/core-plugins/custom-themes/indexed-db/service-init.bg-worker";
import { BUILTIN_THEME_REGISTRY } from "@/entrypoints/core-plugins/custom-themes/themes/built-in-themes";
import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";

export async function getThemeCss(themeId: Theme["id"]) {
  return getBuiltInThemeCss(themeId) || (await getLocalThemeCss(themeId)) || "";
}

export function getBuiltInThemeCss(themeId: Theme["id"]) {
  return (
    BUILTIN_THEME_REGISTRY.find((theme) => theme.id === themeId)?.css ?? ""
  );
}

export async function getLocalThemeCss(themeId: Theme["id"]) {
  return (await LocalThemesService.Instance.get(themeId))?.css ?? "";
}
