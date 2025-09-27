import { BUILTIN_THEME_REGISTRY } from "@/data/dashboard/themes/built-in-themes";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import { LocalThemesService } from "@/plugins/_core/custom-theme/indexed-db/service-init.bg-worker";

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
